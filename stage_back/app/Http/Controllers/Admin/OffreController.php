<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Departement;
use App\Http\Requests\Admin\StoreOffreRequest;
use App\Http\Requests\Admin\UpdateOffreRequest;
use App\Http\Resources\OffreResource;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    /**
     * Liste toutes les offres
     */
    public function index(Request $request)
    {
        $query = Offre::with(['departement', 'createur']);

        // Filtre par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtre par département
        if ($request->has('departement_id')) {
            $query->where('departement_id', $request->departement_id);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $offres = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'offres' => OffreResource::collection($offres),
            'pagination' => [
                'total' => $offres->total(),
                'per_page' => $offres->perPage(),
                'current_page' => $offres->currentPage(),
                'last_page' => $offres->lastPage()
            ]
        ], 200);
    }

    /**
     * Créer une nouvelle offre
     */
    public function store(StoreOffreRequest $request)
    {
        try {
            $offre = Offre::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'departement_id' => $request->departement_id,
                'duree_jours' => $request->duree_jours,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'competences_requises' => $request->competences_requises,
                'nombre_places' => $request->nombre_places,
                'statut' => $request->statut ?? 'ouvert',
                'created_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Offre créée avec succès.',
                'offre' => new OffreResource($offre->load('departement'))
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'offre.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une offre
     */
    public function show($id)
    {
        $offre = Offre::with(['departement', 'createur', 'candidatures.stagiaire.user'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'offre' => new OffreResource($offre)
        ], 200);
    }

    /**
     * Modifier une offre
     */
    public function update(UpdateOffreRequest $request, $id)
    {
        try {
            $offre = Offre::findOrFail($id);

            $offre->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Offre modifiée avec succès.',
                'offre' => new OffreResource($offre->load('departement'))
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une offre
     */
    public function destroy($id)
    {
        try {
            $offre = Offre::findOrFail($id);

            // Vérifier s'il y a des candidatures
            if ($offre->candidatures()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer une offre ayant des candidatures.'
                ], 422);
            }

            $offre->delete();

            return response()->json([
                'success' => true,
                'message' => 'Offre supprimée avec succès.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Changer le statut d'une offre
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:ouvert,ferme'
        ]);

        $offre = Offre::findOrFail($id);
        $offre->update(['statut' => $request->statut]);

        return response()->json([
            'success' => true,
            'message' => 'Statut modifié avec succès.',
            'offre' => new OffreResource($offre)
        ], 200);
    }
}