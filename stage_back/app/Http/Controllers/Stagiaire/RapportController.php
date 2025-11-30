<?php

namespace App\Http\Controllers\Stagiaire;

use App\Http\Controllers\Controller;
use App\Models\{Rapport, Stage};
use App\Http\Requests\Stagiaire\UploadRapportRequest;
use App\Http\Requests\Stagiaire\UpdateRapportRequest;
use App\Http\Resources\RapportResource;
use App\Services\NotificationService;
use App\Mail\RapportDepose;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail, Storage};

class RapportController extends Controller
{
    /**
     * Déposer un rapport
     */
    public function store(UploadRapportRequest $request)
    {
        try {
            $stagiaire = auth()->user()->stagiaire;

            // Vérifier que le stagiaire a un stage en cours
            $stage = $stagiaire->stage;

            if (!$stage || $stage->statut !== 'en_cours') {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas de stage en cours.'
                ], 422);
            }

            // Vérifier qu'un rapport final n'existe pas déjà
            if ($request->type === 'final') {
                $existingFinalReport = $stage->rapports()
                    ->where('type', 'final')
                    ->exists();

                if ($existingFinalReport) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Vous avez déjà déposé un rapport final.'
                    ], 422);
                }
            }

            DB::beginTransaction();

            // Upload fichier
            $fichierPath = $request->file('fichier')->store(
                "rapports/{$stage->id}",
                'public'
            );

            // Créer le rapport
            $rapport = Rapport::create([
                'stage_id' => $stage->id,
                'type' => $request->type,
                'titre' => $request->titre,
                'fichier_path' => $fichierPath,
                'date_depot' => now(),
                'statut' => 'en_attente'
            ]);

            // Créer notification pour l'encadrant
            NotificationService::rapportDepose(
                $stage->encadrant,
                $stagiaire,
                $rapport
            );

            // Envoyer email à l'encadrant
            Mail::to($stage->encadrant->user->email)
                ->send(new RapportDepose($rapport, $stagiaire));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Rapport déposé avec succès.',
                'rapport' => new RapportResource($rapport)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Supprimer le fichier si l'upload a réussi mais la transaction a échoué
            if (isset($fichierPath) && Storage::disk('public')->exists($fichierPath)) {
                Storage::disk('public')->delete($fichierPath);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du dépôt du rapport.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un rapport
     */
    public function update(UpdateRapportRequest $request, $id)
    {
        try {
            $stagiaire = auth()->user()->stagiaire;

            $rapport = Rapport::where('id', $id)
                ->whereHas('stage', function($q) use ($stagiaire) {
                    $q->whereHas('candidature', function($subQ) use ($stagiaire) {
                        $subQ->where('stagiaire_id', $stagiaire->id);
                    });
                })
                ->firstOrFail();

            // Vérifier si le rapport peut être modifié
            if ($rapport->statut === 'valide') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce rapport a déjà été validé et ne peut plus être modifié.'
                ], 422);
            }

            DB::beginTransaction();

            $data = [
                'titre' => $request->titre ?? $rapport->titre,
                'description' => $request->description ?? $rapport->description,
                'type' => $request->type ?? $rapport->type,
                'statut' => 'en_attente', // Remettre en attente après modification
                'corrections_demandees' => null // Effacer les corrections demandées car traitées
            ];

            // Gérer le nouveau fichier si présent
            if ($request->hasFile('fichier')) {
                // Supprimer l'ancien fichier
                if (Storage::disk('public')->exists($rapport->fichier_path)) {
                    Storage::disk('public')->delete($rapport->fichier_path);
                }

                // Upload nouveau fichier
                $fichierPath = $request->file('fichier')->store(
                    "rapports/{$rapport->stage_id}",
                    'public'
                );
                $data['fichier_path'] = $fichierPath;
                $data['date_depot'] = now(); // Mettre à jour la date de dépôt
            }

            $rapport->update($data);

            // Créer notification pour l'encadrant
            NotificationService::create(
                $rapport->stage->encadrant->user_id,
                'rapport_modifie',
                'Rapport modifié',
                "Le stagiaire {$stagiaire->user->name} a modifié son rapport '{$rapport->titre}'.",
                "/encadrant/rapports/{$rapport->id}"
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Rapport mis à jour avec succès.',
                'rapport' => new RapportResource($rapport)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du rapport.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mes rapports
     */
    public function index(Request $request)
    {
        $stagiaire = auth()->user()->stagiaire;

        if (!$stagiaire->stage) {
            return response()->json([
                'success' => true,
                'rapports' => [],
                'message' => 'Vous n\'avez pas de stage.'
            ], 200);
        }

        $query = $stagiaire->stage->rapports();

        // Filtre par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'date_depot');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $rapports = $query->get();

        return response()->json([
            'success' => true,
            'rapports' => RapportResource::collection($rapports),
            'stats' => [
                'total' => $rapports->count(),
                'en_attente' => $rapports->where('statut', 'en_attente')->count(),
                'valide' => $rapports->where('statut', 'valide')->count(),
                'a_corriger' => $rapports->where('statut', 'a_corriger')->count()
            ]
        ], 200);
    }

    /**
     * Détails d'un rapport
     */
    public function show($id)
    {
        $stagiaire = auth()->user()->stagiaire;

        $rapport = Rapport::where('id', $id)
            ->whereHas('stage', function($q) use ($stagiaire) {
                $q->whereHas('candidature', function($subQ) use ($stagiaire) {
                    $subQ->where('stagiaire_id', $stagiaire->id);
                });
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'rapport' => new RapportResource($rapport)
        ], 200);
    }

    /**
     * Télécharger un rapport
     */
    public function download($id)
    {
        $stagiaire = auth()->user()->stagiaire;

        $rapport = Rapport::where('id', $id)
            ->whereHas('stage', function($q) use ($stagiaire) {
                $q->whereHas('candidature', function($subQ) use ($stagiaire) {
                    $subQ->where('stagiaire_id', $stagiaire->id);
                });
            })
            ->firstOrFail();

        if (!Storage::disk('public')->exists($rapport->fichier_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $rapport->fichier_path,
            $rapport->titre . '.pdf'
        );
    }
}