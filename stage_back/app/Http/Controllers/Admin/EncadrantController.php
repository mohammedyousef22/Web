<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Encadrant};
use App\Http\Requests\Admin\StoreEncadrantRequest;
use App\Http\Resources\EncadrantResource;
use App\Mail\WelcomeEncadrant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Hash, Mail};
use Illuminate\Support\Str;

class EncadrantController extends Controller
{
    /**
     * Liste tous les encadrants
     */
    public function index(Request $request)
    {
        $query = Encadrant::with(['user', 'departement'])
            ->withCount('stages');

        // Filtre par département
        if ($request->has('departement_id')) {
            $query->where('departement_id', $request->departement_id);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'name') {
            $query->join('users', 'encadrants.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortOrder)
                  ->select('encadrants.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $encadrants = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'encadrants' => EncadrantResource::collection($encadrants),
            'pagination' => [
                'total' => $encadrants->total(),
                'per_page' => $encadrants->perPage(),
                'current_page' => $encadrants->currentPage(),
                'last_page' => $encadrants->lastPage()
            ]
        ], 200);
    }

    /**
     * Créer un encadrant
     */
    public function store(StoreEncadrantRequest $request)
    {
        try {
            DB::beginTransaction();

            // Générer mot de passe temporaire
            $tempPassword = Str::random(12);

            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($tempPassword),
                'role' => 'encadrant',
                'is_active' => true
            ]);

            // Créer le profil encadrant
            $encadrant = Encadrant::create([
                'user_id' => $user->id,
                'departement_id' => $request->departement_id,
                'specialite' => $request->specialite,
                'telephone' => $request->telephone
            ]);

            // Envoyer email avec identifiants
            Mail::to($user->email)->send(new WelcomeEncadrant($user, $tempPassword));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Encadrant créé avec succès. Un email avec les identifiants a été envoyé.',
                'encadrant' => new EncadrantResource($encadrant->load(['user', 'departement']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'encadrant.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un encadrant
     */
    public function show($id)
    {
        $encadrant = Encadrant::with([
                'user',
                'departement',
                'stages.candidature.stagiaire.user',
                'stages.candidature.offre'
            ])
            ->withCount('stages')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'encadrant' => new EncadrantResource($encadrant)
        ], 200);
    }

    /**
     * Modifier un encadrant
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'departement_id' => 'sometimes|exists:departements,id',
            'specialite' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20'
        ]);

        try {
            DB::beginTransaction();

            $encadrant = Encadrant::findOrFail($id);

            // Mettre à jour user si nécessaire
            if ($request->has('name') || $request->has('email')) {
                $encadrant->user->update($request->only(['name', 'email']));
            }

            // Mettre à jour encadrant
            $encadrant->update($request->only(['departement_id', 'specialite', 'telephone']));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Encadrant modifié avec succès.',
                'encadrant' => new EncadrantResource($encadrant->load(['user', 'departement']))
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un encadrant
     */
    public function destroy($id)
    {
        try {
            $encadrant = Encadrant::findOrFail($id);

            // Vérifier s'il y a des stages en cours
            if ($encadrant->stages()->where('statut', 'en_cours')->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un encadrant ayant des stages en cours.'
                ], 422);
            }

            DB::beginTransaction();

            $user = $encadrant->user;
            $encadrant->delete();
            $user->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Encadrant supprimé avec succès.'
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
}