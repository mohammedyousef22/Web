<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\{User, Stagiaire, Encadrant, Offre, Rapport};

class NotificationService
{
    /**
     * Créer une notification générique
     */
    public static function create($userId, $type, $titre, $message, $lien = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'titre' => $titre,
            'message' => $message,
            'lien' => $lien,
            'is_read' => false
        ]);
    }

    /**
     * Notification: Candidature acceptée
     */
    public static function candidatureAcceptee($stagiaire, $offre)
    {
        return self::create(
            $stagiaire->user_id,
            'candidature_acceptee',
            'Candidature acceptée! 🎉',
            "Votre candidature pour '{$offre->titre}' a été acceptée.",
            '/stagiaire/mon-stage'
        );
    }

    /**
     * Notification: Nouveau stagiaire assigné (pour encadrant)
     */
    public static function nouveauStagiaire($encadrant, $stagiaire)
    {
        return self::create(
            $encadrant->user_id,
            'nouveau_stagiaire',
            'Nouveau stagiaire assigné',
            "Vous avez un nouveau stagiaire: {$stagiaire->user->name}",
            '/encadrant/mes-stagiaires'
        );
    }

    /**
     * Notification: Rapport déposé (pour encadrant)
     */
    public static function rapportDepose($encadrant, $stagiaire, $rapport)
    {
        return self::create(
            $encadrant->user_id,
            'rapport_depose',
            'Nouveau rapport déposé 📝',
            "{$stagiaire->user->name} a déposé un rapport {$rapport->type}.",
            "/encadrant/rapports/{$rapport->id}"
        );
    }

    /**
     * Créer plusieurs notifications (pour tous les admins)
     */
    public static function notifierTousLesAdmins($type, $titre, $message, $lien = null)
    {
        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            self::create($admin->id, $type, $titre, $message, $lien);
        }
    }
}