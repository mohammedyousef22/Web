<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Stagiaire, Encadrant, Offre, Candidature, Stage};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Statistiques du dashboard admin
     */
    public function stats(Request $request)
    {
        // KPIs généraux
        $totalStagiaires = Stagiaire::count();
        $totalEncadrants = Encadrant::count();
        $offresActives = Offre::where('statut', 'ouvert')->count();
        $candidaturesEnAttente = Candidature::where('statut', 'en_attente')->count();
        $stagesEnCours = Stage::where('statut', 'en_cours')->count();
        $stagesTermines = Stage::where('statut', 'termine')->count();

        // Taux d'acceptation
        $totalCandidatures = Candidature::count();
        $candidaturesAcceptees = Candidature::where('statut', 'accepte')->count();
        $tauxAcceptation = $totalCandidatures > 0 
            ? round(($candidaturesAcceptees / $totalCandidatures) * 100, 2) 
            : 0;

        // Candidatures par mois (6 derniers mois)
        $candidaturesParMois = Candidature::select(
                DB::raw('DATE_FORMAT(date_candidature, "%Y-%m") as mois'),
                DB::raw('COUNT(*) as total')
            )
            ->where('date_candidature', '>=', Carbon::now()->subMonths(6))
            ->groupBy('mois')
            ->orderBy('mois', 'asc')
            ->get()
            ->map(function($item) {
                return [
                    'mois' => $item->mois,
                    'total' => $item->total
                ];
            });

        // Répartition par département
        $repartitionDepartements = Offre::select(
                'departements.nom',
                DB::raw('COUNT(candidatures.id) as total')
            )
            ->join('departements', 'offres.departement_id', '=', 'departements.id')
            ->leftJoin('candidatures', 'offres.id', '=', 'candidatures.offre_id')
            ->groupBy('departements.id', 'departements.nom')
            ->get()
            ->map(function($item) {
                return [
                    'nom' => $item->nom,
                    'total' => $item->total
                ];
            });

        // Top 5 encadrants (plus de stagiaires)
        $topEncadrants = Encadrant::withCount('stages')
            ->with('user:id,name,email')
            ->orderBy('stages_count', 'desc')
            ->take(5)
            ->get()
            ->map(function($encadrant) {
                return [
                    'id' => $encadrant->id,
                    'name' => $encadrant->user->name,
                    'email' => $encadrant->user->email,
                    'stages_count' => $encadrant->stages_count
                ];
            });

        // Dernières candidatures (10 dernières)
        $dernieresCandidatures = Candidature::with([
                'stagiaire.user:id,name,email',
                'offre:id,titre'
            ])
            ->select('id', 'stagiaire_id', 'offre_id', 'statut', 'date_candidature')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($candidature) {
                return [
                    'id' => $candidature->id,
                    'stagiaire_name' => $candidature->stagiaire->user->name,
                    'stagiaire_email' => $candidature->stagiaire->user->email,
                    'offre_titre' => $candidature->offre->titre,
                    'statut' => $candidature->statut,
                    'date_candidature' => $candidature->date_candidature->format('d/m/Y')
                ];
            });

        // Évolution des stages par mois
        $stagesParMois = Stage::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as mois'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('mois')
            ->orderBy('mois', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'kpis' => [
                'total_stagiaires' => $totalStagiaires,
                'total_encadrants' => $totalEncadrants,
                'offres_actives' => $offresActives,
                'candidatures_en_attente' => $candidaturesEnAttente,
                'stages_en_cours' => $stagesEnCours,
                'stages_termines' => $stagesTermines,
                'taux_acceptation' => $tauxAcceptation
            ],
            'graphiques' => [
                'candidatures_par_mois' => $candidaturesParMois,
                'repartition_departements' => $repartitionDepartements,
                'stages_par_mois' => $stagesParMois
            ],
            'top_encadrants' => $topEncadrants,
            'dernieres_candidatures' => $dernieresCandidatures
        ], 200);
    }
}