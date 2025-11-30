<?php

namespace App\Http\Controllers\Stagiaire;

use App\Http\Controllers\Controller;
use App\Models\Stagiaire;
use App\Http\Requests\Stagiaire\{UpdateProfileRequest, UploadCVRequest};
use App\Http\Resources\StagiaireResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Storage};

class ProfileController extends Controller
{
    /**
     * Afficher le profil
     */
    public function show(Request $request)
    {
        $stagiaire = $request->user()->stagiaire->load(['user', 'stage.encadrant.user']);

        return response()->json([
            'success' => true,
            'stagiaire' => new StagiaireResource($stagiaire)
        ], 200);
    }

    /**
     * Modifier le profil
     */
    public function update(UpdateProfileRequest $request)
    {
        try {
            $user = $request->user();
            $stagiaire = $user->stagiaire;

            DB::beginTransaction();

            // Mettre à jour user
            if ($request->has('name') || $request->has('email')) {
                $user->update($request->only(['name', 'email']));
            }

            // Mettre à jour stagiaire
            $stagiaire->update($request->only([
                'cin',
                'date_naissance',
                'telephone',
                'etablissement',
                'niveau_etude',
                'filiere',
                'adresse'
            ]));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Profil modifié avec succès.',
                'stagiaire' => new StagiaireResource($stagiaire->load('user'))
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification du profil.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload ou remplacer CV
     */
    public function uploadCV(UploadCVRequest $request)
    {
        try {
            $stagiaire = $request->user()->stagiaire;

            // Supprimer l'ancien CV s'il existe
            if ($stagiaire->cv_path && Storage::disk('public')->exists($stagiaire->cv_path)) {
                Storage::disk('public')->delete($stagiaire->cv_path);
            }

            // Upload nouveau CV
            $cvPath = $request->file('cv')->store(
                "cv/{$request->user()->id}",
                'public'
            );

            // Mettre à jour le chemin
            $stagiaire->update(['cv_path' => $cvPath]);

            return response()->json([
                'success' => true,
                'message' => 'CV mis à jour avec succès.',
                'cv_path' => $cvPath,
                'cv_url' => Storage::disk('public')->url($cvPath)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload du CV.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Télécharger mon CV
     */
    public function downloadCV(Request $request)
    {
        $stagiaire = $request->user()->stagiaire;

        if (!$stagiaire->cv_path || !Storage::disk('public')->exists($stagiaire->cv_path)) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $stagiaire->cv_path,
            'Mon_CV.pdf'
        );
    }
}