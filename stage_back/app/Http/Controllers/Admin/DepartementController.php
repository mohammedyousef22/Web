<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use App\Http\Requests\Admin\StoreDepartementRequest;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    /**
     * Liste tous les départements
     */
    public function index(Request $request)
    {
        $query = Departement::withCount(['encadrants', 'offres']);

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'LIKE', "%{$search}%");
        }

        // Tri
        $sortBy = $request->get('sort_by', 'nom');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        if ($request->has('per_page') && $request->per_page === 'all') {
            $departements = $query->get();
            
            return response()->json([
                'success' => true,
                'departements' => $departements
            ], 200);
        }

        $departements = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'departements' => $departements->items(),
            'pagination' => [
                'total' => $departements->total(),
                'per_page' => $departements->perPage(),
                'current_page' => $departements->currentPage(),
                'last_page' => $departements->lastPage()
            ]
        ], 200);
    }

    /**
     * Créer un département
     */
    public function store(StoreDepartementRequest $request)
    {
        try {
            $departement = Departement::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Département créé avec succès.',
                'departement' => $departement
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du département.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un département
     */
    public function show($id)
    {
        $departement = Departement::withCount(['encadrants', 'offres'])
            ->with(['encadrants.user', 'offres' => function($q) {
                $q->where('statut', 'ouvert')->take(5);
            }])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'departement' => $departement
        ], 200);
    }

    /**
     * Modifier un département
     */
    public function update(StoreDepartementRequest $request, $id)
    {
        try {
            $departement = Departement::findOrFail($id);
            $departement->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Département modifié avec succès.',
                'departement' => $departement
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
     * Supprimer un département
     */
    public function destroy($id)
    {
        try {
            $departement = Departement::findOrFail($id);

            // Vérifier s'il y a des encadrants
            if ($departement->encadrants()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un département ayant des encadrants.'
                ], 422);
            }

            // Vérifier s'il y a des offres
            if ($departement->offres()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un département ayant des offres.'
                ], 422);
            }

            $departement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Département supprimé avec succès.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}