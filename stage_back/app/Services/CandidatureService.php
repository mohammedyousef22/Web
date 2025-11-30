<?php

namespace App\Services;

use App\Models\{Candidature, Offre, Stagiaire, Encadrant};
use App\Mail\{CandidatureAcceptee, CandidatureRefusee, CandidatureConfirmation};
use Illuminate\Support\Facades\{DB, Mail};

class CandidatureService
{
    /**
     * Soumettre une candidature
     */
    public static function postuler(Stagiaire $stagiaire, Offre $offre, $lettreMotivation)
    {
        try {
            // Vérifications préalables
            $verification = self::verifierEligibilite($stagiaire, $offre);
            
            if (!$verification['eligible']) {
                throw new \Exception($verification['raison']);
            }

            DB::beginTransaction();

            // Créer la candidature
            $candidature = Candidature::create([
                'offre_id' => $offre->id,
                'stagiaire_id' => $stagiaire->id,
                'lettre_motivation' => $lettreMotivation,
                'statut' => 'en_attente',
                'date_candidature' => now()
            ]);

            // Notifier tous les admins
            NotificationService::notifierTousLesAdmins(
                'nouvelle_candidature',
                'Nouvelle candidature',
                "{$stagiaire->user->name} a postulé pour '{$offre->titre}'.",
                '/admin/candidatures'
            );

            // Envoyer email de confirmation au stagiaire
            Mail::to($stagiaire->user->email)
                ->send(new CandidatureConfirmation($candidature));

            DB::commit();

            return [
                'success' => true,
                'candidature' => $candidature
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de la candidature: " . $e->getMessage());
        }
    }

    /**
     * Vérifier l'éligibilité d'un stagiaire pour postuler
     */
    public static function verifierEligibilite(Stagiaire $stagiaire, Offre $offre): array
    {
        // Vérifier que l'offre est ouverte
        if (!$offre->isOuvert()) {
            return [
                'eligible' => false,
                'raison' => 'Cette offre est fermée.'
            ];
        }

        // Vérifier qu'il reste des places
        if ($offre->getPlacesRestantes() <= 0) {
            return [
                'eligible' => false,
                'raison' => 'Il n\'y a plus de places disponibles pour cette offre.'
            ];
        }

        // Vérifier que le stagiaire n'a pas déjà postulé
        $dejaPostule = Candidature::where('offre_id', $offre->id)
            ->where('stagiaire_id', $stagiaire->id)
            ->exists();

        if ($dejaPostule) {
            return [
                'eligible' => false,
                'raison' => 'Vous avez déjà postulé à cette offre.'
            ];
        }

        // Vérifier que le stagiaire n'a pas de stage en cours
        if ($stagiaire->hasActiveStage()) {
            return [
                'eligible' => false,
                'raison' => 'Vous avez déjà un stage en cours.'
            ];
        }

        return [
            'eligible' => true,
            'raison' => null
        ];
    }

    /**
     * Accepter une candidature
     */
    public static function accepter(Candidature $candidature, $encadrantId)
    {
        try {
            // Vérifications
            if ($candidature->statut !== 'en_attente') {
                throw new \Exception('Cette candidature a déjà été traitée.');
            }

            $stagiaire = $candidature->stagiaire;
            if ($stagiaire->hasActiveStage()) {
                throw new \Exception('Ce stagiaire a déjà un stage en cours.');
            }

            $encadrant = Encadrant::findOrFail($encadrantId);

            DB::beginTransaction();

            // Mettre à jour la candidature
            $candidature->update([
                'statut' => 'accepte',
                'date_reponse' => now()
            ]);

            // Créer le stage
            $stage = StageService::creerStage($candidature, $encadrant->id);

            // Notifications
            NotificationService::candidatureAcceptee($stagiaire, $candidature->offre);
            NotificationService::nouveauStagiaire($encadrant, $stagiaire);

            // Emails
            Mail::to($stagiaire->user->email)
                ->send(new CandidatureAcceptee($candidature, $stage));

            Mail::to($encadrant->user->email)
                ->send(new \App\Mail\NouveauStagiaire($stagiaire, $stage));

            DB::commit();

            return [
                'success' => true,
                'candidature' => $candidature,
                'stage' => $stage
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de l'acceptation: " . $e->getMessage());
        }
    }

    /**
     * Refuser une candidature
     */
    public static function refuser(Candidature $candidature, $motif = null)
    {
        try {
            if ($candidature->statut !== 'en_attente') {
                throw new \Exception('Cette candidature a déjà été traitée.');
            }

            DB::beginTransaction();

            // Mettre à jour la candidature
            $candidature->update([
                'statut' => 'refuse',
                'date_reponse' => now()
            ]);

            // Notification
            NotificationService::create(
                $candidature->stagiaire->user_id,
                'candidature_refusee',
                'Candidature refusée',
                "Votre candidature pour '{$candidature->offre->titre}' a été refusée." . 
                ($motif ? " Motif: {$motif}" : ''),
                '/stagiaire/candidatures'
            );

            // Email
            Mail::to($candidature->stagiaire->user->email)
                ->send(new CandidatureRefusee($candidature));

            DB::commit();

            return [
                'success' => true,
                'candidature' => $candidature
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors du refus: " . $e->getMessage());
        }
    }

    /**
     * Annuler une candidature (par le stagiaire)
     */
    public static function annuler(Candidature $candidature)
    {
        try {
            if ($candidature->statut !== 'en_attente') {
                throw new \Exception('Seules les candidatures en attente peuvent être annulées.');
            }

            DB::beginTransaction();

            $candidature->delete();

            // Notifier les admins
            NotificationService::notifierTousLesAdmins(
                'candidature_annulee',
                'Candidature annulée',
                "{$candidature->stagiaire->user->name} a annulé sa candidature pour '{$candidature->offre->titre}'.",
                '/admin/candidatures'
            );

            DB::commit();

            return [
                'success' => true,
                'message' => 'Candidature annulée avec succès.'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de l'annulation: " . $e->getMessage());
        }
    }

    /**
     * Obtenir les statistiques des candidatures
     */
    public static function getStatistiques(): array
    {
        $total = Candidature::count();
        $enAttente = Candidature::where('statut', 'en_attente')->count();
        $acceptees = Candidature::where('statut', 'accepte')->count();
        $refusees = Candidature::where('statut', 'refuse')->count();

        return [
            'total' => $total,
            'en_attente' => $enAttente,
            'acceptees' => $acceptees,
            'refusees' => $refusees,
            'taux_acceptation' => $total > 0 ? round(($acceptees / $total) * 100, 2) : 0,
            'taux_refus' => $total > 0 ? round(($refusees / $total) * 100, 2) : 0
        ];
    }

    /**
     * Obtenir les candidatures en attente depuis plus de X jours
     */
    public static function getCandidaturesEnRetard($joursLimite = 7)
    {
        return Candidature::where('statut', 'en_attente')
            ->where('date_candidature', '<=', now()->subDays($joursLimite))
            ->with(['stagiaire.user', 'offre'])
            ->get();
    }

    /**
     * Réassigner une candidature à un autre encadrant
     */
    public static function reassignerEncadrant(Candidature $candidature, $nouvelEncadrantId)
    {
        try {
            if ($candidature->statut !== 'accepte' || !$candidature->stage) {
                throw new \Exception('Cette candidature n\'a pas de stage assigné.');
            }

            $stage = $candidature->stage;
            $ancienEncadrant = $stage->encadrant;
            $nouvelEncadrant = Encadrant::findOrFail($nouvelEncadrantId);

            DB::beginTransaction();

            $stage->update([
                'encadrant_id' => $nouvelEncadrant->id
            ]);

            // Notifications
            NotificationService::create(
                $candidature->stagiaire->user_id,
                'changement_encadrant',
                'Changement d\'encadrant',
                "Votre encadrant a été modifié: {$nouvelEncadrant->user->name}",
                '/stagiaire/mon-stage'
            );

            NotificationService::create(
                $nouvelEncadrant->user_id,
                'nouveau_stagiaire',
                'Nouveau stagiaire assigné',
                "Vous avez un nouveau stagiaire: {$candidature->stagiaire->user->name}",
                '/encadrant/mes-stagiaires'
            );

            DB::commit();

            return [
                'success' => true,
                'stage' => $stage
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Erreur lors de la réassignation: " . $e->getMessage());
        }
    }

    /**
     * Vérifier les candidatures multiples d'un stagiaire
     */
    public static function getCandidaturesStagiaire(Stagiaire $stagiaire): array
    {
        $candidatures = $stagiaire->candidatures()->with('offre')->get();

        return [
            'total' => $candidatures->count(),
            'en_attente' => $candidatures->where('statut', 'en_attente')->count(),
            'acceptees' => $candidatures->where('statut', 'accepte')->count(),
            'refusees' => $candidatures->where('statut', 'refuse')->count(),
            'candidatures' => $candidatures
        ];
    }
}