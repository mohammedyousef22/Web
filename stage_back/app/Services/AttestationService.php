<?php

namespace App\Services;

use App\Models\Stage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class AttestationService
{
    /**
     * Générer une attestation de stage
     */
    public static function generer(Stage $stage)
    {
        $stagiaire = $stage->candidature->stagiaire;
        $encadrant = $stage->encadrant;
        $evaluation = $stage->evaluation;
        $offre = $stage->candidature->offre;

        // Données pour le template
        $data = [
            // Objets complets pour accès dans le template
            'stage' => $stage,
            'stagiaire' => $stagiaire,
            'encadrant' => $encadrant,
            'evaluation' => $evaluation,
            'offre' => $offre,
            
            // Stagiaire
            'nom_stagiaire' => $stagiaire->user->name,
            'cin' => $stagiaire->cin ?? 'N/A',
            'etablissement' => $stagiaire->etablissement,
            'niveau_etude' => $stagiaire->niveau_etude,
            'filiere' => $stagiaire->filiere,
            
            // Stage
            'titre_stage' => $offre->titre,
            'departement' => $offre->departement->nom,
            'date_debut' => $stage->date_debut_reelle->format('d/m/Y'),
            'date_fin' => $stage->date_fin_reelle->format('d/m/Y'),
            'duree_jours' => $stage->getDureeJours(),
            
            // Encadrant
            'nom_encadrant' => $encadrant->user->name,
            'specialite_encadrant' => $encadrant->specialite ?? '',
            
            // Évaluation
            'note' => $evaluation->note ?? 'N/A',
            'mention' => $evaluation ? $evaluation->getMention() : 'N/A',
            'appreciation' => $evaluation->appreciation ?? '',
            
            // Génération
            'date_generation' => now()->format('d/m/Y'),
            'numero_attestation' => 'ATT-' . $stage->id . '-' . now()->format('Y')
        ];

        // Générer le PDF
        $pdf = Pdf::loadView('attestations.template', $data)
            ->setPaper('a4', 'portrait');

        // Enregistrer le fichier
        $filename = "attestation_{$stage->id}.pdf";
        $path = "attestations/{$stage->id}/{$filename}";
        
        Storage::disk('public')->put($path, $pdf->output());

        // Mettre à jour le stage
        $stage->update(['attestation_path' => $path]);

        return $path;
    }

    /**
     * Télécharger une attestation existante
     */
    public static function telecharger(Stage $stage)
    {
        if (!$stage->attestation_path || !Storage::disk('public')->exists($stage->attestation_path)) {
            return null;
        }

        return Storage::disk('public')->path($stage->attestation_path);
    }
}