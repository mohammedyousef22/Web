<?php

namespace App\Services;

use App\Models\{Stage, Candidature, Stagiaire};
use Illuminate\Support\Facades\DB;

class StageService
{
    /**
     * Créer un stage à partir d'une candidature acceptée
     */
    public static function creerStage(Candidature $candidature, $encadrantId)
    {
        try {
            $offre = $candidature->offre;

            $stage = Stage::create([
                'candidature_id' => $candidature->id,
                'encadrant_id' => $encadrantId,
                'date_debut_reelle' => $offre->date_debut,
                'date_fin_reelle' => $offre->date_fin,
                'statut' => 'en_cours'
            ]);

            return $stage;
        } catch (\Exception $e) {
            throw new \Exception("Erreur lors de la création du stage: " . $e->getMessage());
        }
    }

    /**
     * Vérifier si un stagiaire peut avoir un nouveau stage
     */
    public static function stagiaireDisponible(Stagiaire $stagiaire): bool
    {
        // Vérifier qu'il n'a pas de stage en cours
        return !$stagiaire->hasActiveStage();
    }

    /**
     * Marquer un stage comme terminé
     */
    public static function terminerStage(Stage $stage, $noteFinal, $commentaireFinal)
    {
        try {
            DB::beginTransaction();

            $stage->update([
                'statut' => 'termine',
                'note_finale' => $noteFinal,
                'commentaire_final' => $commentaireFinal
            ]);

            DB::commit();

            return $stage;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de la finalisation du stage: " . $e->getMessage());
        }
    }

    /**
     * Interrompre un stage
     */
    public static function interrompreStage(Stage $stage, $raison = null)
    {
        try {
            DB::beginTransaction();

            $stage->update([
                'statut' => 'interrompu',
                'commentaire_final' => $raison ?? 'Stage interrompu'
            ]);

            // Notifier le stagiaire et l'encadrant
            NotificationService::create(
                $stage->candidature->stagiaire->user_id,
                'stage_interrompu',
                'Stage interrompu ⚠️',
                'Votre stage a été interrompu.',
                '/stagiaire/mon-stage'
            );

            NotificationService::create(
                $stage->encadrant->user_id,
                'stage_interrompu',
                'Stage interrompu',
                "Le stage de {$stage->candidature->stagiaire->user->name} a été interrompu.",
                '/encadrant/mes-stagiaires'
            );

            DB::commit();

            return $stage;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de l'interruption du stage: " . $e->getMessage());
        }
    }

    /**
     * Obtenir les stages qui se terminent bientôt
     */
    public static function getStagesProcheFin($joursDAvance = 7)
    {
        return Stage::where('statut', 'en_cours')
            ->whereDate('date_fin_reelle', '=', now()->addDays($joursDAvance)->toDateString())
            ->with(['candidature.stagiaire.user', 'encadrant.user'])
            ->get();
    }

    /**
     * Obtenir les statistiques d'un stage
     */
    public static function getStatistiquesStage(Stage $stage): array
    {
        return [
            'duree_jours' => $stage->getDureeJours(),
            'progression' => $stage->getProgressPercentage(),
            'jours_restants' => $stage->getJoursRestants(),
            'jours_ecoules' => $stage->date_debut_reelle->diffInDays(now()),
            'rapports_count' => $stage->rapports()->count(),
            'rapports_valides' => $stage->rapports()->where('statut', 'valide')->count(),
            'rapports_en_attente' => $stage->rapports()->where('statut', 'en_attente')->count(),
            'a_evaluation' => $stage->hasEvaluation(),
            'a_attestation' => $stage->hasAttestation(),
            'is_en_cours' => $stage->isEnCours(),
            'is_termine' => $stage->isTermine()
        ];
    }

    /**
     * Vérifier si un stage est éligible pour évaluation
     */
    public static function eligiblePourEvaluation(Stage $stage): array
    {
        $eligible = true;
        $raisons = [];

        // Vérifier que le rapport final est validé
        $rapportFinalValide = $stage->rapports()
            ->where('type', 'final')
            ->where('statut', 'valide')
            ->exists();

        if (!$rapportFinalValide) {
            $eligible = false;
            $raisons[] = 'Le rapport final doit être validé.';
        }

        // Vérifier qu'il n'y a pas déjà d'évaluation
        if ($stage->hasEvaluation()) {
            $eligible = false;
            $raisons[] = 'Ce stage a déjà été évalué.';
        }

        // Vérifier que le stage n'est pas interrompu
        if ($stage->statut === 'interrompu') {
            $eligible = false;
            $raisons[] = 'Le stage a été interrompu.';
        }

        return [
            'eligible' => $eligible,
            'raisons' => $raisons
        ];
    }

    /**
     * Prolonger la durée d'un stage
     */
    public static function prolongerStage(Stage $stage, $nouveauDateFin)
    {
        try {
            if ($stage->statut !== 'en_cours') {
                throw new \Exception('Seuls les stages en cours peuvent être prolongés.');
            }

            if ($nouveauDateFin <= $stage->date_fin_reelle) {
                throw new \Exception('La nouvelle date de fin doit être postérieure à la date de fin actuelle.');
            }

            DB::beginTransaction();

            $stage->update([
                'date_fin_reelle' => $nouveauDateFin
            ]);

            // Notifier le stagiaire
            NotificationService::create(
                $stage->candidature->stagiaire->user_id,
                'stage_prolonge',
                'Stage prolongé 📅',
                "Votre stage a été prolongé jusqu'au {$nouveauDateFin}.",
                '/stagiaire/mon-stage'
            );

            DB::commit();

            return $stage;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de la prolongation: " . $e->getMessage());
        }
    }

    /**
     * Obtenir le résumé des stages d'un encadrant
     */
    public static function getResumeStagesEncadrant($encadrantId): array
    {
        $stages = Stage::where('encadrant_id', $encadrantId)->get();

        return [
            'total' => $stages->count(),
            'en_cours' => $stages->where('statut', 'en_cours')->count(),
            'termines' => $stages->where('statut', 'termine')->count(),
            'interrompus' => $stages->where('statut', 'interrompu')->count(),
            'moyenne_notes' => $stages->whereNotNull('note_finale')->avg('note_finale'),
            'rapports_en_attente' => Stage::where('encadrant_id', $encadrantId)
                ->whereHas('rapports', function($q) {
                    $q->where('statut', 'en_attente');
                })
                ->count()
        ];
    }

    /**
     * Calculer le taux de réussite global
     */
    public static function getTauxReussiteGlobal(): array
    {
        $stagesTermines = Stage::where('statut', 'termine')
            ->whereNotNull('note_finale')
            ->get();

        $total = $stagesTermines->count();

        if ($total === 0) {
            return [
                'taux_reussite' => 0,
                'moyenne_generale' => 0,
                'total_evalues' => 0
            ];
        }

        $reussis = $stagesTermines->where('note_finale', '>=', 10)->count();
        $moyenneGenerale = $stagesTermines->avg('note_finale');

        return [
            'taux_reussite' => round(($reussis / $total) * 100, 2),
            'moyenne_generale' => round($moyenneGenerale, 2),
            'total_evalues' => $total,
            'reussis' => $reussis,
            'echecs' => $total - $reussis
        ];
    }
}