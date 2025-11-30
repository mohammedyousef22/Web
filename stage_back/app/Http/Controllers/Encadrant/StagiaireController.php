<?php

namespace App\Http\Controllers\Encadrant;

use App\Http\Controllers\Controller;
use App\Models\{Stage, Stagiaire};
use App\Http\Resources\{StageResource, StagiaireResource};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StagiaireController extends Controller
{
    /**
     * Liste de mes stagiaires
     */
    public function index(Request $request)
    {
        $encadrant = $request->user()->encadrant;

        $query = $encadrant->stages()
            ->with([
                'candidature.stagiaire.user',
                'candidature.offre',
                'rapports',
                'evaluation'
            ]);

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('candidature.stagiaire.user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $stages = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'stages' => StageResource::collection($stages),
            'pagination' => [
                'total' => $stages->total(),
                'per_page' => $stages->perPage(),
                'current_page' => $stages->currentPage(),
                'last_page' => $stages->lastPage()
            ],
            'stats' => [
                'total' => $encadrant->stages()->count(),
                'en_cours' => $encadrant->stages()->where('statut', 'en_cours')->count(),
                'termine' => $encadrant->stages()->where('statut', 'termine')->count()
            ]
        ], 200);
    }

    /**
     * Détails d'un stagiaire
     */
    public function show($stagiaireId)
    {
        $encadrant = auth()->user()->encadrant;

        // Trouver le stage de ce stagiaire encadré par cet encadrant
        $stage = Stage::where('encadrant_id', $encadrant->id)
            ->whereHas('candidature', function($q) use ($stagiaireId) {
                $q->where('stagiaire_id', $stagiaireId);
            })
            ->with([
                'candidature.stagiaire.user',
                'candidature.stagiaire',
                'candidature.offre.departement',
                'rapports',
                'evaluation'
            ])
            ->first();

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Stagiaire non trouvé ou non encadré par vous.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'stage' => new StageResource($stage),
            'stagiaire' => new StagiaireResource($stage->candidature->stagiaire),
            'progression' => $stage->getProgressPercentage(),
            'jours_restants' => $stage->getJoursRestants()
        ], 200);
    }

    /**
     * Télécharger le CV d'un stagiaire
     */
    public function downloadCV($stagiaireId)
    {
        $encadrant = auth()->user()->encadrant;

        // Vérifier que l'encadrant encadre bien ce stagiaire
        $stage = Stage::where('encadrant_id', $encadrant->id)
            ->whereHas('candidature', function($q) use ($stagiaireId) {
                $q->where('stagiaire_id', $stagiaireId);
            })
            ->with('candidature.stagiaire.user')
            ->first();

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Stagiaire non trouvé ou non encadré par vous.'
            ], 404);
        }

        $stagiaire = $stage->candidature->stagiaire;

        if (!$stagiaire->cv_path || !Storage::disk('public')->exists($stagiaire->cv_path)) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $stagiaire->cv_path,
            'CV_' . $stagiaire->user->name . '.pdf'
        );
    }
}