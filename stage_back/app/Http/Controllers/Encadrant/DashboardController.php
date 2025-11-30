<?php

namespace App\Http\Controllers\Encadrant;

use App\Http\Controllers\Controller;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Statistiques dashboard encadrant
     */
    public function stats(Request $request)
    {
        $encadrant = $request->user()->encadrant;

        // KPIs
        $totalStagiaires = $encadrant->stages()->count();
        $stagesEnCours = $encadrant->stages()->where('statut', 'en_cours')->count();
        $stagesTermines = $encadrant->stages()->where('statut', 'termine')->count();
        
        $rapportsEnAttente = $encadrant->stages()
            ->whereHas('rapports', function($q) {
                $q->where('statut', 'en_attente');
            })
            ->withCount(['rapports' => function($q) {
                $q->where('statut', 'en_attente');
            }])
            ->get()
            ->sum('rapports_count');

        // Moyenne des notes données
        $moyenneNotes = $encadrant->stages()
            ->whereNotNull('note_finale')
            ->avg('note_finale');

        // Évolution stagiaires par mois (6 derniers mois)
        $stagiairesParMois = $encadrant->stages()
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as mois'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('mois')
            ->orderBy('mois', 'asc')
            ->get();

        // Mes stagiaires actifs
        $stagiairesActifs = $encadrant->stages()
            ->where('statut', 'en_cours')
            ->with([
                'candidature.stagiaire.user',
                'candidature.offre'
            ])
            ->get()
            ->map(function($stage) {
                return [
                    'stage_id' => $stage->id,
                    'stagiaire' => [
                        'id' => $stage->candidature->stagiaire->id,
                        'name' => $stage->candidature->stagiaire->user->name,
                        'email' => $stage->candidature->stagiaire->user->email,
                        'etablissement' => $stage->candidature->stagiaire->etablissement,
                        'filiere' => $stage->candidature->stagiaire->filiere
                    ],
                    'offre_titre' => $stage->candidature->offre->titre,
                    'date_debut' => $stage->date_debut_reelle->format('d/m/Y'),
                    'date_fin' => $stage->date_fin_reelle->format('d/m/Y'),
                    'progression' => $stage->getProgressPercentage(),
                    'jours_restants' => $stage->getJoursRestants()
                ];
            });

        // Rapports récents en attente
        $rapportsRecents = $encadrant->stages()
            ->with(['rapports' => function($q) {
                $q->where('statut', 'en_attente')
                  ->orderBy('date_depot', 'desc')
                  ->take(5);
            }, 'candidature.stagiaire.user'])
            ->get()
            ->pluck('rapports')
            ->flatten()
            ->map(function($rapport) {
                return [
                    'rapport_id' => $rapport->id,
                    'titre' => $rapport->titre,
                    'type' => $rapport->type,
                    'stagiaire_name' => $rapport->stage->candidature->stagiaire->user->name,
                    'date_depot' => $rapport->date_depot->format('d/m/Y'),
                    'jours_depuis_depot' => $rapport->getJoursDepuisDepot(),
                    'is_urgent' => $rapport->isUrgent()
                ];
            });

        return response()->json([
            'success' => true,
            'kpis' => [
                'total_stagiaires' => $totalStagiaires,
                'stages_en_cours' => $stagesEnCours,
                'stages_termines' => $stagesTermines,
                'rapports_en_attente' => $rapportsEnAttente,
                'moyenne_notes' => round($moyenneNotes, 2)
            ],
            'graphiques' => [
                'stagiaires_par_mois' => $stagiairesParMois
            ],
            'stagiaires_actifs' => $stagiairesActifs,
            'rapports_recents' => $rapportsRecents
        ], 200);
    }
}