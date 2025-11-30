<?php

namespace App\Services;

use App\Models\{Stagiaire, Encadrant, Stage};
use Barryvdh\DomPDF\Facade\Pdf;

class ExportService
{
    /**
     * Exporter les stagiaires en PDF
     */
    public static function exportStagiairesPDF($filters = [])
    {
        $query = Stagiaire::with(['user', 'stage.encadrant.user', 'stage.candidature.offre']);

        // Appliquer les filtres
        if (isset($filters['etablissement'])) {
            $query->where('etablissement', 'LIKE', "%{$filters['etablissement']}%");
        }

        if (isset($filters['filiere'])) {
            $query->where('filiere', 'LIKE', "%{$filters['filiere']}%");
        }

        $stagiaires = $query->get();

        $pdf = Pdf::loadView('exports.stagiaires-pdf', [
            'stagiaires' => $stagiaires,
            'date' => now()->format('d/m/Y'),
            'filters' => $filters
        ]);

        return $pdf->download('stagiaires_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Exporter les encadrants en PDF
     */
    public static function exportEncadrantsPDF($filters = [])
    {
        $query = Encadrant::with(['user', 'departement'])->withCount('stages');

        if (isset($filters['departement_id'])) {
            $query->where('departement_id', $filters['departement_id']);
        }

        $encadrants = $query->get();

        $pdf = Pdf::loadView('exports.encadrants-pdf', [
            'encadrants' => $encadrants,
            'date' => now()->format('d/m/Y')
        ]);

        return $pdf->download('encadrants_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Exporter les stages en PDF
     */
    public static function exportStagesPDF($filters = [])
    {
        $query = Stage::with([
            'candidature.stagiaire.user',
            'candidature.offre',
            'encadrant.user',
            'evaluation'
        ]);

        // Appliquer les filtres
        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['date_debut'])) {
            $query->whereDate('date_debut_reelle', '>=', $filters['date_debut']);
        }

        if (isset($filters['date_fin'])) {
            $query->whereDate('date_fin_reelle', '<=', $filters['date_fin']);
        }

        $stages = $query->get();

        $pdf = Pdf::loadView('exports.stages-pdf', [
            'stages' => $stages,
            'date' => now()->format('d/m/Y')
        ]);

        return $pdf->download('stages_' . now()->format('Y-m-d') . '.pdf');
    }
}