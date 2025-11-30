<?php

namespace App\Http\Controllers\Encadrant;

use App\Http\Controllers\Controller;
use App\Models\{Stage, Evaluation};
use App\Http\Requests\Encadrant\EvaluationRequest;
use App\Http\Resources\EvaluationResource;
use App\Services\{NotificationService, AttestationService};
use App\Mail\EvaluationDisponible;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail};

class EvaluationController extends Controller
{
    /**
     * Créer une évaluation
     */
    public function store(EvaluationRequest $request)
    {
        try {
            $encadrant = auth()->user()->encadrant;

            $stage = Stage::where('encadrant_id', $encadrant->id)
                ->with([
                    'candidature.stagiaire.user',
                    'candidature.offre.departement',
                    'encadrant.user'
                ])
                ->findOrFail($request->stage_id);

            // Vérifier que le stage est en cours ou terminé
            if ($stage->statut === 'interrompu') {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible d\'évaluer un stage interrompu.'
                ], 422);
            }

            // Vérifier qu'une évaluation n'existe pas déjà
            if ($stage->evaluation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce stagiaire a déjà été évalué.'
                ], 422);
            }

            // Vérifier que le rapport final est validé
            $rapportFinalValide = $stage->rapports()
                ->where('type', 'final')
                ->where('statut', 'valide')
                ->exists();

            if (!$rapportFinalValide) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le rapport final doit être validé avant l\'évaluation.'
                ], 422);
            }

            DB::beginTransaction();

            // Créer l'évaluation
            $evaluation = Evaluation::create([
                'stage_id' => $stage->id,
                'note' => $request->note,
                'competences_acquises' => $request->competences_acquises,
                'appreciation' => $request->appreciation,
                'created_by' => $encadrant->user_id
            ]);

            // Mettre à jour le stage
            $stage->update([
                'statut' => 'termine',
                'note_finale' => $request->note,
                'commentaire_final' => $request->appreciation
            ]);

            // Générer l'attestation
            $attestationPath = AttestationService::generer($stage);

            // Recharger le stage pour obtenir le chemin de l'attestation
            $stage->refresh();

            // Créer notification pour le stagiaire
            NotificationService::create(
                $stage->candidature->stagiaire->user_id,
                'evaluation_disponible',
                'Évaluation disponible 🎓',
                "Votre évaluation finale est disponible. Note: {$request->note}/20",
                '/stagiaire/mon-stage'
            );

            // Envoyer email avec attestation
            Mail::to($stage->candidature->stagiaire->user->email)
                ->send(new EvaluationDisponible($stage, $evaluation));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Évaluation créée avec succès. Attestation générée.',
                'evaluation' => new EvaluationResource($evaluation)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'évaluation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une évaluation
     */
    public function show($stageId)
    {
        $encadrant = auth()->user()->encadrant;

        $stage = Stage::where('encadrant_id', $encadrant->id)
            ->with(['evaluation', 'candidature.stagiaire.user'])
            ->findOrFail($stageId);

        if (!$stage->evaluation) {
            return response()->json([
                'success' => false,
                'message' => 'Ce stagiaire n\'a pas encore été évalué.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'evaluation' => new EvaluationResource($stage->evaluation)
        ], 200);
    }

    /**
     * Modifier une évaluation
     */
    public function update(EvaluationRequest $request, $id)
    {
        try {
            $encadrant = auth()->user()->encadrant;

            $evaluation = Evaluation::whereHas('stage', function($q) use ($encadrant) {
                $q->where('encadrant_id', $encadrant->id);
            })
            ->with('stage')
            ->findOrFail($id);

            // Mettre à jour l'évaluation
            $evaluation->update([
                'note' => $request->note,
                'competences_acquises' => $request->competences_acquises,
                'appreciation' => $request->appreciation
            ]);

            // Mettre à jour le stage
            $evaluation->stage->update([
                'note_finale' => $request->note,
                'commentaire_final' => $request->appreciation
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Évaluation modifiée avec succès.',
                'evaluation' => new EvaluationResource($evaluation)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}