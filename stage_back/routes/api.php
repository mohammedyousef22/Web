<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\{
    AuthController,
    NotificationController
};
use App\Http\Controllers\Admin\{
    CandidatureController as AdminCandidatureController,
    DashboardController as AdminDashboardController,
    DepartementController as AdminDepartementController,
    EncadrantController as AdminEncadrantController,
    ExportController as AdminExportController,
    OffreController as AdminOffreController,
    StagiaireController as AdminStagiaireController
};
use App\Http\Controllers\Stagiaire\{
    CandidatureController as StagiaireCandidatureController,
    OffreController as StagiaireOffreController,
    ProfileController as StagiaireProfileController,
    RapportController as StagiaireRapportController,
    StageController as StagiaireStageController
};
use App\Http\Controllers\Encadrant\{
    DashboardController as EncadrantDashboardController,
    EvaluationController as EncadrantEvaluationController,
    RapportController as EncadrantRapportController,
    StagiaireController as EncadrantStagiaireController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ========================================
// PUBLIC ROUTES (Non authentifiées)
// ========================================

Route::prefix('auth')->group(function () {
    // Inscription stagiaire
    Route::post('/register', [AuthController::class, 'register']);
    
    // Connexion (tous les rôles)
    Route::post('/login', [AuthController::class, 'login']);
    
    // Mot de passe oublié
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    
    // Réinitialiser mot de passe
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// ========================================
// PROTECTED ROUTES (Authentifiées)
// ========================================

Route::middleware('auth:sanctum')->group(function () {
    
    // ====================================
    // AUTH ROUTES (Tous les rôles)
    // ====================================
    
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
    
    // ====================================
    // NOTIFICATIONS (Tous les rôles)
    // ====================================
    
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });
    
    // ====================================
    // ADMIN ROUTES
    // ====================================
    
    Route::middleware('admin')->prefix('admin')->group(function () {
        
        // Dashboard & Statistiques
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
        
        // ---- OFFRES ----
        Route::prefix('offres')->group(function () {
            Route::get('/', [AdminOffreController::class, 'index']);
            Route::post('/', [AdminOffreController::class, 'store']);
            Route::get('/{id}', [AdminOffreController::class, 'show']);
            Route::put('/{id}', [AdminOffreController::class, 'update']);
            Route::delete('/{id}', [AdminOffreController::class, 'destroy']);
            Route::patch('/{id}/status', [AdminOffreController::class, 'updateStatus']);
        });
        
        // ---- CANDIDATURES ----
        Route::prefix('candidatures')->group(function () {
            Route::get('/', [AdminCandidatureController::class, 'index']);
            Route::get('/{id}', [AdminCandidatureController::class, 'show']);
            Route::patch('/{id}/accept', [AdminCandidatureController::class, 'accept']);
            Route::patch('/{id}/reject', [AdminCandidatureController::class, 'reject']);
        });
        
        // ---- ENCADRANTS ----
        Route::prefix('encadrants')->group(function () {
            Route::get('/', [AdminEncadrantController::class, 'index']);
            Route::post('/', [AdminEncadrantController::class, 'store']);
            Route::get('/{id}', [AdminEncadrantController::class, 'show']);
            Route::put('/{id}', [AdminEncadrantController::class, 'update']);
            Route::delete('/{id}', [AdminEncadrantController::class, 'destroy']);
        });
        
        // ---- STAGIAIRES ----
        Route::prefix('stagiaires')->group(function () {
            Route::get('/', [AdminStagiaireController::class, 'index']);
            Route::get('/{id}', [AdminStagiaireController::class, 'show']);
            Route::delete('/{id}', [AdminStagiaireController::class, 'destroy']);
            Route::patch('/{id}/toggle-status', [AdminStagiaireController::class, 'toggleStatus']);
            Route::get('/{id}/download-cv', [AdminStagiaireController::class, 'downloadCV']);
        });
        
        // ---- DÉPARTEMENTS ----
        Route::prefix('departements')->group(function () {
            Route::get('/', [AdminDepartementController::class, 'index']);
            Route::post('/', [AdminDepartementController::class, 'store']);
            Route::get('/{id}', [AdminDepartementController::class, 'show']);
            Route::put('/{id}', [AdminDepartementController::class, 'update']);
            Route::delete('/{id}', [AdminDepartementController::class, 'destroy']);
        });

         // ---- STAGES ----
        Route::prefix('stages')->group(function () {
            Route::get('/', [AdminStageController::class, 'index']);
            Route::get('/{id}', [AdminStageController::class, 'show']);
        });
        
        // ---- EXPORTS ----
        Route::prefix('export')->group(function () {
            // PDF
            Route::get('/stagiaires/pdf', [AdminExportController::class, 'exportStagiairesPDF']);
            Route::get('/encadrants/pdf', [AdminExportController::class, 'exportEncadrantsPDF']);
            Route::get('/stages/pdf', [AdminExportController::class, 'exportStagesPDF']);
            
            // Excel
            Route::get('/stagiaires/excel', [AdminExportController::class, 'exportStagiairesExcel']);
            Route::get('/encadrants/excel', [AdminExportController::class, 'exportEncadrantsExcel']);
            Route::get('/stages/excel', [AdminExportController::class, 'exportStagesExcel']);
        });
    });
    
    // ====================================
    // STAGIAIRE ROUTES
    // ====================================
    
    Route::middleware('stagiaire')->prefix('stagiaire')->group(function () {
        
        // ---- OFFRES (Consultation) ----
        Route::prefix('offres')->group(function () {
            Route::get('/', [StagiaireOffreController::class, 'index']);
            Route::get('/{id}', [StagiaireOffreController::class, 'show']);
        });
        
        // ---- CANDIDATURES ----
        Route::prefix('candidatures')->group(function () {
            Route::get('/', [StagiaireCandidatureController::class, 'index']);
            Route::post('/', [StagiaireCandidatureController::class, 'store']);
            Route::get('/{id}', [StagiaireCandidatureController::class, 'show']);
        });
        
        // ---- MON STAGE ----
        Route::prefix('stage')->group(function () {
            Route::get('/mon-stage', [StagiaireStageController::class, 'monStage']);
            Route::get('/mon-encadrant', [StagiaireStageController::class, 'monEncadrant']);
            Route::get('/mon-evaluation', [StagiaireStageController::class, 'monEvaluation']);
            Route::get('/download-attestation', [StagiaireStageController::class, 'downloadAttestation']);
        });
        
        // ---- RAPPORTS ----
        Route::prefix('rapports')->group(function () {
            Route::get('/', [StagiaireRapportController::class, 'index']);
            Route::post('/', [StagiaireRapportController::class, 'store']);
            Route::get('/{id}', [StagiaireRapportController::class, 'show']);
            Route::put('/{id}', [StagiaireRapportController::class, 'update']);
            Route::get('/{id}/download', [StagiaireRapportController::class, 'download']);
        });
        
        // ---- PROFIL ----
        Route::prefix('profil')->group(function () {
            Route::get('/', [StagiaireProfileController::class, 'show']);
            Route::put('/', [StagiaireProfileController::class, 'update']);
            Route::post('/cv', [StagiaireProfileController::class, 'uploadCV']);
            Route::get('/cv/download', [StagiaireProfileController::class, 'downloadCV']);
        });
    });
    
    // ====================================
    // ENCADRANT ROUTES
    // ====================================
    
    Route::middleware('encadrant')->prefix('encadrant')->group(function () {
        
        // Dashboard
        Route::get('/dashboard/stats', [EncadrantDashboardController::class, 'stats']);
        
        // ---- MES STAGIAIRES ----
        Route::prefix('stagiaires')->group(function () {
            Route::get('/', [EncadrantStagiaireController::class, 'index']);
            Route::get('/{id}', [EncadrantStagiaireController::class, 'show']);
            Route::get('/{id}/download-cv', [EncadrantStagiaireController::class, 'downloadCV']);
        });
        
        // ---- RAPPORTS ----
        Route::prefix('rapports')->group(function () {
            Route::get('/', [EncadrantRapportController::class, 'index']);
            Route::get('/{id}', [EncadrantRapportController::class, 'show']);
            Route::patch('/{id}/valider', [EncadrantRapportController::class, 'valider']);
            Route::patch('/{id}/corriger', [EncadrantRapportController::class, 'demanderCorrections']);
            Route::get('/{id}/download', [EncadrantRapportController::class, 'download']);
        });
        
        // ---- ÉVALUATIONS ----
        Route::prefix('evaluations')->group(function () {
            Route::post('/', [EncadrantEvaluationController::class, 'store']);
            Route::get('/{stageId}', [EncadrantEvaluationController::class, 'show']);
            Route::put('/{id}', [EncadrantEvaluationController::class, 'update']);
        });
    });
});

// ========================================
// FALLBACK ROUTE (404)
// ========================================

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route non trouvée.'
    ], 404);
});
