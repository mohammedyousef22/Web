<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Stagiaire, Encadrant, Stage};
use App\Exports\{StagiairesExport, EncadrantsExport, StagesExport};
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf; 
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    /**
     * Exporter les stagiaires en PDF
     */
    public function exportStagiairesPDF(Request $request)
    {
        try {
            $query = Stagiaire::with(['user', 'stage.encadrant.user', 'stage.candidature.offre']);

            // Filtres
            if ($request->has('etablissement')) {
                $query->where('etablissement', $request->etablissement);
            }

            if ($request->has('filiere')) {
                $query->where('filiere', $request->filiere);
            }

            $stagiaires = $query->get();

            $pdf = Pdf::loadView('exports.stagiaires-pdf', [
                'stagiaires' => $stagiaires,
                'date' => now()->format('d/m/Y'),
                'filters' => $request->only(['etablissement', 'filiere'])
            ]);

            return $pdf->download('stagiaires_' . now()->format('Y-m-d') . '.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export PDF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les stagiaires en Excel
     */
    public function exportStagiairesExcel(Request $request)
    {
        try {
            return Excel::download(
                new StagiairesExport($request->all()),
                'stagiaires_' . now()->format('Y-m-d') . '.xlsx'
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export Excel.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les encadrants en PDF
     */
    public function exportEncadrantsPDF(Request $request)
    {
        try {
            $query = Encadrant::with(['user', 'departement'])
                ->withCount('stages');

            if ($request->has('departement_id')) {
                $query->where('departement_id', $request->departement_id);
            }

            $encadrants = $query->get();

            $pdf = Pdf::loadView('exports.encadrants-pdf', [
                'encadrants' => $encadrants,
                'date' => now()->format('d/m/Y')
            ]);

            return $pdf->download('encadrants_' . now()->format('Y-m-d') . '.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export PDF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les encadrants en Excel
     */
    public function exportEncadrantsExcel(Request $request)
    {
        try {
            return Excel::download(
                new EncadrantsExport($request->all()),
                'encadrants_' . now()->format('Y-m-d') . '.xlsx'
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export Excel.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les stages en PDF
     */
    public function exportStagesPDF(Request $request)
    {
        try {
            $query = Stage::with([
                'candidature.stagiaire.user',
                'candidature.offre',
                'encadrant.user',
                'evaluation'
            ]);

            // Filtres
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->has('date_debut')) {
                $query->whereDate('date_debut_reelle', '>=', $request->date_debut);
            }

            if ($request->has('date_fin')) {
                $query->whereDate('date_fin_reelle', '<=', $request->date_fin);
            }

            $stages = $query->get();

            $pdf = Pdf::loadView('exports.stages-pdf', [
                'stages' => $stages,
                'date' => now()->format('d/m/Y')
            ]);

            return $pdf->download('stages_' . now()->format('Y-m-d') . '.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export PDF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les stages en Excel
     */
    public function exportStagesExcel(Request $request)
    {
        try {
            return Excel::download(
                new StagesExport($request->all()),
                'stages_' . now()->format('Y-m-d') . '.xlsx'
            );

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export Excel.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}