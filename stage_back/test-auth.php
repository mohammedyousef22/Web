// Test de diagnostic Sanctum
// Exécuter avec: php artisan tinker < test-auth.php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== DIAGNOSTIC AUTHENTIFICATION SANCTUM ===\n\n";

// 1. Vérifier les utilisateurs
echo "1. Comptage des utilisateurs:\n";
echo "   Total users: " . User::count() . "\n";
echo "   Admins: " . User::where('role', 'admin')->count() . "\n";
echo "   Stagiaires: " . User::where('role', 'stagiaire')->count() . "\n";
echo "   Encadrants: " . User::where('role', 'encadrant')->count() . "\n\n";

// 2. Vérifier si l'admin existe
echo "2. Vérification de l'admin:\n";
$admin = User::where('email', 'admin@stages.ma')->first();
if ($admin) {
    echo "   ✓ Admin trouvé: " . $admin->name . "\n";
    echo "   Email: " . $admin->email . "\n";
    echo "   Role: " . $admin->role . "\n";
    echo "   Active: " . ($admin->is_active ? 'Oui' : 'Non') . "\n";
    
    // Test du mot de passe
    $passwordOk = Hash::check('admin123', $admin->password);
    echo "   Password 'admin123': " . ($passwordOk ? '✓ Correct' : '✗ Incorrect') . "\n\n";
    
    // 3. Créer un token de test
    echo "3. Création d'un token de test:\n";
    $token = $admin->createToken('test-token');
    echo "   Token créé: " . $token->plainTextToken . "\n";
    echo "   Token ID: " . $token->accessToken->id . "\n\n";
    
    // 4. Vérifier la table personal_access_tokens
    echo "4. Tokens dans la base:\n";
    $tokenCount = \Laravel\Sanctum\PersonalAccessToken::count();
    echo "   Total tokens: " . $tokenCount . "\n";
    
} else {
    echo "   ✗ ERREUR: Admin non trouvé!\n";
    echo "   Vous devez exécuter: php artisan db:seed\n\n";
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";
