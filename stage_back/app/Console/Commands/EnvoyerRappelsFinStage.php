<?php

namespace App\Console\Commands;

use App\Models\Stage;
use App\Mail\RappelFinStage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class EnvoyerRappelsFinStage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stages:rappel-fin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie un rappel 7 jours avant la fin des stages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Recherche des stages se terminant dans 7 jours...');

        // Récupérer les stages en cours qui se terminent dans 7 jours
        $stages = Stage::where('statut', 'en_cours')
            ->whereDate('date_fin_reelle', '=', now()->addDays(7)->toDateString())
            ->with(['candidature.stagiaire.user', 'encadrant.user'])
            ->get();

        if ($stages->isEmpty()) {
            $this->info('✅ Aucun stage ne se termine dans 7 jours.');
            return 0;
        }

        $count = 0;

        foreach ($stages as $stage) {
            try {
                // Email au stagiaire
                Mail::to($stage->candidature->stagiaire->user->email)
                    ->send(new RappelFinStage($stage, 'stagiaire'));

                // Email à l'encadrant
                Mail::to($stage->encadrant->user->email)
                    ->send(new RappelFinStage($stage, 'encadrant'));

                $count++;
                $this->info("✅ Rappels envoyés pour le stage ID: {$stage->id}");
            } catch (\Exception $e) {
                $this->error("❌ Erreur pour le stage ID {$stage->id}: " . $e->getMessage());
            }
        }

        $this->info("🎉 Terminé! {$count} rappels envoyés.");
        return 0;
    }
}