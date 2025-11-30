<?php

namespace App\Http\Controllers\Stagiaire;

use App\Http\Controllers\Controller;
use App\Models\{Candidature, Offre};
use App\Http\Requests\Stagiaire\PostulerRequest;
use App\Http\Resources\CandidatureResource;
use App\Services\NotificationService;
use App\Mail\CandidatureConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail};

class CandidatureController extends Controller
{
    /**
     * Postuler à une offre
     */
    public function store(PostulerRequest $request)
    {
        try {
            $stagiaire = auth()->user()->stagiaire;

            // Vérifier que l'offre est ouverte
            $offre = Offre::where('id', $request->offre_id)
                ->where('statut', 'ouvert')
                ->firstOrFail();

            // Vérifier que le stagiaire n'a pas déjà postulé
            $dejaPostule = Candidature::where('offre_id', $offre->id)
                ->where('stagiaire_id', $stagiaire->id)
                ->exists();

            if ($dejaPostule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà postulé à cette offre.'
                ], 422);
            }

            // Vérifier que le stagiaire n'a pas de stage en cours
            if ($stagiaire->hasActiveStage()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà un stage en cours.'
                ], 422);
            }

            DB::beginTransaction();

            // Créer la candidature
            $candidature = Candidature::create([
                'offre_id' => $offre->id,
                'stagiaire_id' => $stagiaire->id,
                'lettre_motivation' => $request->lettre_motivation,
                'statut' => 'en_attente',
                'date_candidature' => now()
            ]);

            // Créer notification pour l'admin
            $admins = \App\Models\User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                NotificationService::create(
                    $admin->id,
                    'nouvelle_candidature',
                    'Nouvelle candidature',
                    "{$stagiaire->user->name} a postulé pour '{$offre->titre}'.",
                    '/admin/candidatures'
                );
            }

            // Envoyer email de confirmation au stagiaire
            Mail::to($stagiaire->user->email)
                ->send(new CandidatureConfirmation($candidature));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidature envoyée avec succès!',
                'candidature' => new CandidatureResource($candidature->load(['offre', 'stagiaire.user']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mes candidatures
     */
    public function index(Request $request)
    {
        $stagiaire = auth()->user()->stagiaire;

        $query = $stagiaire->candidatures()
            ->with(['offre.departement', 'stage.encadrant.user']);

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'date_candidature');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $candidatures = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'candidatures' => CandidatureResource::collection($candidatures),
            'pagination' => [
                'total' => $candidatures->total(),
                'per_page' => $candidatures->perPage(),
                'current_page' => $candidatures->currentPage(),
                'last_page' => $candidatures->lastPage()
            ],
            'stats' => [
                'en_attente' => $stagiaire->candidatures()->where('statut', 'en_attente')->count(),
                'accepte' => $stagiaire->candidatures()->where('statut', 'accepte')->count(),
                'refuse' => $stagiaire->candidatures()->where('statut', 'refuse')->count()
            ]
        ], 200);
    }

    /**
     * Détails d'une candidature
     */
    public function show($id)
    {
        $stagiaire = auth()->user()->stagiaire;

        $candidature = Candidature::where('id', $id)
            ->where('stagiaire_id', $stagiaire->id)
            ->with(['offre.departement', 'stage.encadrant.user'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'candidature' => new CandidatureResource($candidature)
        ], 200);
    }
}