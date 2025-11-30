<?php

namespace App\Http\Controllers\Encadrant;

use App\Http\Controllers\Controller;
use App\Models\Rapport;
use App\Http\Requests\Encadrant\ValiderRapportRequest;
use App\Http\Resources\RapportResource;
use App\Services\NotificationService;
use App\Mail\{RapportValide, RapportACorreiger};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail, Storage};

class RapportController extends Controller
{
    /**
     * Liste des rapports de mes stagiaires
     */
    public function index(Request $request)
    {
        $encadrant = $request->user()->encadrant;

        $query = Rapport::whereHas('stage', function($q) use ($encadrant) {
            $q->where('encadrant_id', $encadrant->id);
        })->with([
            'stage.candidature.stagiaire.user',
            'stage.candidature.offre'
        ]);

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtre par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtre par stagiaire
        if ($request->has('stagiaire_id')) {
            $query->whereHas('stage.candidature', function($q) use ($request) {
                $q->where('stagiaire_id', $request->stagiaire_id);
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'date_depot');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $rapports = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'rapports' => RapportResource::collection($rapports),
            'pagination' => [
                'total' => $rapports->total(),
                'per_page' => $rapports->perPage(),
                'current_page' => $rapports->currentPage(),
                'last_page' => $rapports->lastPage()
            ],
            'stats' => [
                'en_attente' => Rapport::whereHas('stage', function($q) use ($encadrant) {
                    $q->where('encadrant_id', $encadrant->id);
                })->where('statut', 'en_attente')->count(),
                'valide' => Rapport::whereHas('stage', function($q) use ($encadrant) {
                    $q->where('encadrant_id', $encadrant->id);
                })->where('statut', 'valide')->count(),
                'a_corriger' => Rapport::whereHas('stage', function($q) use ($encadrant) {
                    $q->where('encadrant_id', $encadrant->id);
                })->where('statut', 'a_corriger')->count()
            ]
        ], 200);
    }

    /**
     * Détails d'un rapport
     */
    public function show($id)
    {
        $encadrant = auth()->user()->encadrant;

        $rapport = Rapport::whereHas('stage', function($q) use ($encadrant) {
            $q->where('encadrant_id', $encadrant->id);
        })
        ->with([
            'stage.candidature.stagiaire.user',
            'stage.candidature.offre'
        ])
        ->findOrFail($id);

        return response()->json([
            'success' => true,
            'rapport' => new RapportResource($rapport)
        ], 200);
    }

    /**
     * Valider un rapport
     */
    public function valider(ValiderRapportRequest $request, $id)
    {
        try {
            $encadrant = auth()->user()->encadrant;

            $rapport = Rapport::whereHas('stage', function($q) use ($encadrant) {
                $q->where('encadrant_id', $encadrant->id);
            })
            ->with('stage.candidature.stagiaire.user')
            ->findOrFail($id);

            // Vérifier que le rapport est en attente
            if ($rapport->statut !== 'en_attente' && $rapport->statut !== 'a_corriger') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce rapport a déjà été validé.'
                ], 422);
            }

            DB::beginTransaction();

            // Mettre à jour le rapport
            $rapport->update([
                'statut' => 'valide',
                'commentaire_encadrant' => $request->commentaire ?? null,
                'date_validation' => now()
            ]);

            // Créer notification pour le stagiaire
            NotificationService::create(
                $rapport->stage->candidature->stagiaire->user_id,
                'rapport_valide',
                'Rapport validé ✅',
                "Votre rapport '{$rapport->titre}' a été validé par votre encadrant.",
                '/stagiaire/rapports'
            );

            // Envoyer email
            Mail::to($rapport->stage->candidature->stagiaire->user->email)
                ->send(new RapportValide($rapport));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Rapport validé avec succès.',
                'rapport' => new RapportResource($rapport)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation du rapport.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Demander des corrections
     */
    public function demanderCorrections(Request $request, $id)
    {
        $request->validate([
            'commentaire' => 'required|string|min:20'
        ]);

        try {
            $encadrant = auth()->user()->encadrant;

            $rapport = Rapport::whereHas('stage', function($q) use ($encadrant) {
                $q->where('encadrant_id', $encadrant->id);
            })
            ->with('stage.candidature.stagiaire.user')
            ->findOrFail($id);

            // Vérifier que le rapport est en attente
            if ($rapport->statut !== 'en_attente' && $rapport->statut !== 'a_corriger') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce rapport a déjà été traité.'
                ], 422);
            }

            DB::beginTransaction();

            // Mettre à jour le rapport
            $rapport->update([
                'statut' => 'a_corriger',
                'commentaire_encadrant' => $request->commentaire,
                'date_validation' => now()
            ]);

            // Créer notification pour le stagiaire
            NotificationService::create(
                $rapport->stage->candidature->stagiaire->user_id,
                'rapport_a_corriger',
                'Corrections demandées ⚠️',
                "Des corrections sont demandées sur votre rapport '{$rapport->titre}'.",
                '/stagiaire/rapports'
            );

            // Envoyer email
            Mail::to($rapport->stage->candidature->stagiaire->user->email)
                ->send(new RapportACorreiger($rapport));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Demande de corrections envoyée.',
                'rapport' => new RapportResource($rapport)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la demande.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Télécharger un rapport
     */
    public function download($id)
    {
        $encadrant = auth()->user()->encadrant;

        $rapport = Rapport::whereHas('stage', function($q) use ($encadrant) {
            $q->where('encadrant_id', $encadrant->id);
        })->findOrFail($id);

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