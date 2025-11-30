<?php

namespace App\Http\Controllers\Stagiaire;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Departement;
use App\Http\Resources\OffreResource;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    /**
     * Liste des offres ouvertes (pour stagiaires)
     */
    public function index(Request $request)
    {
        $query = Offre::where('statut', 'ouvert')
            ->with(['departement']);

        // Filtre par département
        if ($request->has('departement_id')) {
            $query->where('departement_id', $request->departement_id);
        }

        // Filtre par durée
        if ($request->has('duree_min')) {
            $query->where('duree_jours', '>=', $request->duree_min);
        }

        if ($request->has('duree_max')) {
            $query->where('duree_jours', '<=', $request->duree_max);
        }

        // Filtre par date début
        if ($request->has('date_debut_from')) {
            $query->whereDate('date_debut', '>=', $request->date_debut_from);
        }

        // Recherche par mots-clés
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('competences_requises', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $offres = $query->paginate($request->get('per_page', 12));

        // Récupérer les départements pour les filtres
        $departements = Departement::select('id', 'nom')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'success' => true,
            'offres' => OffreResource::collection($offres),
            'pagination' => [
                'total' => $offres->total(),
                'per_page' => $offres->perPage(),
                'current_page' => $offres->currentPage(),
                'last_page' => $offres->lastPage()
            ],
            'departements' => $departements
        ], 200);
    }

    /**
     * Détails d'une offre
     */
    public function show($id)
    {
        $offre = Offre::where('statut', 'ouvert')
            ->with(['departement'])
            ->withCount(['candidatures' => function($q) {
                $q->where('statut', 'accepte');
            }])
            ->findOrFail($id);

        // Vérifier si le stagiaire a déjà postulé
        $stagiaire = auth()->user()->stagiaire;
        $aDejaPostule = $stagiaire->candidatures()
            ->where('offre_id', $id)
            ->exists();

        return response()->json([
            'success' => true,
            'offre' => new OffreResource($offre),
            'a_deja_postule' => $aDejaPostule,
            'places_restantes' => $offre->getPlacesRestantes()
        ], 200);
    }
}