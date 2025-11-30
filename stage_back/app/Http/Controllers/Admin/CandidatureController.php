<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidature;
use App\Models\Stage;
use App\Models\Encadrant;
use App\Http\Requests\Admin\AcceptCandidatureRequest;
use App\Http\Resources\CandidatureResource;
use App\Services\NotificationService;
use App\Mail\CandidatureAcceptee;
use App\Mail\CandidatureRefusee;
use App\Mail\NouveauStagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CandidatureController extends Controller
{
    /**
     * Liste toutes les candidatures
     */
    public function index(Request $request)
    {
        $query = Candidature::with([
            'stagiaire.user',
            'offre.departement',
            'stage.encadrant.user'
        ]);

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtre par offre
        if ($request->has('offre_id')) {
            $query->where('offre_id', $request->offre_id);
        }

        // Recherche par nom stagiaire
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('stagiaire.user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'date_candidature');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $candidatures = $query->paginate($request->get('per_page', 15));

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
                'en_attente' => Candidature::where('statut', 'en_attente')->count(),
                'accepte' => Candidature::where('statut', 'accepte')->count(),
                'refuse' => Candidature::where('statut', 'refuse')->count()
            ]
        ], 200);
    }

    /**
     * Afficher les détails d'une candidature
     */
    public function show($id)
    {
        $candidature = Candidature::with([
            'stagiaire.user',
            'stagiaire' => function($q) {
                $q->select('id', 'user_id', 'cin', 'telephone', 'etablissement', 
                          'niveau_etude', 'filiere', 'cv_path');
            },
            'offre.departement',
            'stage.encadrant.user'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'candidature' => new CandidatureResource($candidature)
        ], 200);
    }

    /**
     * Accepter une candidature
     */
    public function accept(AcceptCandidatureRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $candidature = Candidature::with(['stagiaire.user', 'offre'])
                ->findOrFail($id);

            // Vérifier si la candidature est en attente
            if ($candidature->statut !== 'en_attente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette candidature a déjà été traitée.'
                ], 422);
            }

            // Vérifier si le stagiaire n'a pas déjà un stage en cours
            $hasActiveStage = Stage::whereHas('candidature', function($q) use ($candidature) {
                $q->where('stagiaire_id', $candidature->stagiaire_id);
            })->where('statut', 'en_cours')->exists();

            if ($hasActiveStage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce stagiaire a déjà un stage en cours.'
                ], 422);
            }

            // Vérifier disponibilité de l'encadrant
            $encadrant = Encadrant::findOrFail($request->encadrant_id);

            // Mettre à jour la candidature
            $candidature->update([
                'statut' => 'accepte',
                'date_reponse' => now()
            ]);

            // Créer le stage
            $stage = Stage::create([
                'candidature_id' => $candidature->id,
                'encadrant_id' => $encadrant->id,
                'date_debut_reelle' => $candidature->offre->date_debut,
                'date_fin_reelle' => $candidature->offre->date_fin,
                'statut' => 'en_cours'
            ]);

            // Créer notification pour le stagiaire
            NotificationService::candidatureAcceptee(
                $candidature->stagiaire,
                $candidature->offre
            );

            // Créer notification pour l'encadrant
            NotificationService::nouveauStagiaire(
                $encadrant,
                $candidature->stagiaire
            );

            // Envoyer emails
            Mail::to($candidature->stagiaire->user->email)
                ->send(new CandidatureAcceptee($candidature, $stage));

            Mail::to($encadrant->user->email)
                ->send(new NouveauStagiaire($candidature->stagiaire, $stage));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidature acceptée avec succès.',
                'candidature' => new CandidatureResource($candidature->load('stage.encadrant.user'))
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'acceptation de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refuser une candidature
     */
    public function reject($id)
    {
        try {
            DB::beginTransaction();

            $candidature = Candidature::with(['stagiaire.user', 'offre'])
                ->findOrFail($id);

            // Vérifier si la candidature est en attente
            if ($candidature->statut !== 'en_attente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette candidature a déjà été traitée.'
                ], 422);
            }

            // Mettre à jour la candidature
            $candidature->update([
                'statut' => 'refuse',
                'date_reponse' => now()
            ]);

            // Créer notification pour le stagiaire
            NotificationService::create(
                $candidature->stagiaire->user_id,
                'candidature_refusee',
                'Candidature refusée',
                "Votre candidature pour '{$candidature->offre->titre}' a été refusée.",
                '/stagiaire/candidatures'
            );

            // Envoyer email
            Mail::to($candidature->stagiaire->user->email)
                ->send(new CandidatureRefusee($candidature));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidature refusée.',
                'candidature' => new CandidatureResource($candidature)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du refus de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}