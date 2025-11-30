<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class CleanExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Supprime les tokens expirés de la base de données';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Nettoyage des tokens expirés...');

        // Supprimer les tokens créés il y a plus de 30 jours
        $deleted = PersonalAccessToken::where('created_at', '<', now()->subDays(30))
            ->delete();

        if ($deleted > 0) {
            $this->info("✅ {$deleted} token(s) supprimé(s).");
        } else {
            $this->info('✅ Aucun token expiré trouvé.');
        }

        return 0;
    }
}