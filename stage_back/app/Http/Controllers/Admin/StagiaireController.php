<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stagiaire;
use App\Http\Resources\StagiaireResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StagiaireController extends Controller
{
    /**
     * Liste tous les stagiaires
     */
    public function index(Request $request)
    {
        $query = Stagiaire::with([
            'user',
            'stage.encadrant.user',
            'stage.candidature.offre'
        ]);

        // Filtre par établissement
        if ($request->has('etablissement')) {
            $query->where('etablissement', 'LIKE', "%{$request->etablissement}%");
        }

        // Filtre par filière
        if ($request->has('filiere')) {
            $query->where('filiere', 'LIKE', "%{$request->filiere}%");
        }

        // Filtre par niveau
        if ($request->has('niveau_etude')) {
            $query->where('niveau_etude', $request->niveau_etude);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($subQ) use ($search) {
                    $subQ->where('name', 'LIKE', "%{$search}%")
                         ->orWhere('email', 'LIKE', "%{$search}%");
                })
                ->orWhere('cin', 'LIKE', "%{$search}%")
                ->orWhere('etablissement', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'name') {
            $query->join('users', 'stagiaires.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortOrder)
                  ->select('stagiaires.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $stagiaires = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'stagiaires' => StagiaireResource::collection($stagiaires),
            'pagination' => [
                'total' => $stagiaires->total(),
                'per_page' => $stagiaires->perPage(),
                'current_page' => $stagiaires->currentPage(),
                'last_page' => $stagiaires->lastPage()
            ]
        ], 200);
    }

    /**
     * Afficher un stagiaire
     */
    public function show($id)
    {
        $stagiaire = Stagiaire::with([
            'user',
            'candidatures.offre.departement',
            'candidatures.stage.encadrant.user',
            'candidatures.stage.rapports',
            'candidatures.stage.evaluation'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'stagiaire' => new StagiaireResource($stagiaire)
        ], 200);
    }

    /**
     * Supprimer un stagiaire
     */
    public function destroy($id)
    {
        try {
            $stagiaire = Stagiaire::findOrFail($id);

            // Vérifier s'il y a un stage en cours
            if ($stagiaire->stage && $stagiaire->stage->statut === 'en_cours') {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un stagiaire avec un stage en cours.'
                ], 422);
            }

            DB::beginTransaction();

            // Supprimer le CV s'il existe
            if ($stagiaire->cv_path && Storage::disk('public')->exists($stagiaire->cv_path)) {
                Storage::disk('public')->delete($stagiaire->cv_path);
            }

            $user = $stagiaire->user;
            $stagiaire->delete();
            $user->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stagiaire supprimé avec succès.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Désactiver/Activer un stagiaire
     */
    public function toggleStatus($id)
    {
        try {
            $stagiaire = Stagiaire::findOrFail($id);
            $user = $stagiaire->user;

            $user->update([
                'is_active' => !$user->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => $user->is_active ? 'Stagiaire activé.' : 'Stagiaire désactivé.',
                'is_active' => $user->is_active
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification du statut.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Télécharger le CV d'un stagiaire
     */
    public function downloadCV($id)
    {
        $stagiaire = Stagiaire::findOrFail($id);

        if (!$stagiaire->cv_path || !Storage::disk('public')->exists($stagiaire->cv_path)) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $stagiaire->cv_path,
            'CV_' . $stagiaire->user->name . '.pdf'
        );
    }
}