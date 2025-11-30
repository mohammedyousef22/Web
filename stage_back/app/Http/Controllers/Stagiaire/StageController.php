<?php

namespace App\Http\Controllers\Stagiaire;

use App\Http\Controllers\Controller;
use App\Http\Resources\{StageResource, EncadrantResource, EvaluationResource};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StageController extends Controller
{
    /**
     * Mon stage actif
     */
    public function monStage(Request $request)
    {
        $stagiaire = $request->user()->stagiaire;
        $stage = $stagiaire->stage;

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas de stage en cours.'
            ], 404);
        }

        $stage->load([
            'candidature.offre.departement',
            'encadrant.user',
            'encadrant.departement',
            'rapports',
            'evaluation'
        ]);

        return response()->json([
            'success' => true,
            'stage' => new StageResource($stage),
            'progression' => $stage->getProgressPercentage(),
            'jours_restants' => $stage->getJoursRestants()
        ], 200);
    }

    /**
     * Infos de mon encadrant
     */
    public function monEncadrant(Request $request)
    {
        $stagiaire = $request->user()->stagiaire;
        $stage = $stagiaire->stage;

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas de stage en cours.'
            ], 404);
        }

        $encadrant = $stage->encadrant->load(['user', 'departement']);

        return response()->json([
            'success' => true,
            'encadrant' => new EncadrantResource($encadrant)
        ], 200);
    }

    /**
     * Mon évaluation
     */
    public function monEvaluation(Request $request)
    {
        $stagiaire = $request->user()->stagiaire;
        $stage = $stagiaire->stage;

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas de stage.'
            ], 404);
        }

        if (!$stage->evaluation) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas encore été évalué.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'evaluation' => new EvaluationResource($stage->evaluation)
        ], 200);
    }

    /**
     * Télécharger mon attestation
     */
    public function downloadAttestation(Request $request)
    {
        $stagiaire = $request->user()->stagiaire;
        $stage = $stagiaire->stage;

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas de stage.'
            ], 404);
        }

        if (!$stage->attestation_path) {
            return response()->json([
                'success' => false,
                'message' => 'Votre attestation n\'est pas encore disponible.'
            ], 404);
        }

        if (!Storage::disk('public')->exists($stage->attestation_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier d\'attestation non trouvé.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $stage->attestation_path,
            'Attestation_Stage_' . $stagiaire->user->name . '.pdf'
        );
    }
}