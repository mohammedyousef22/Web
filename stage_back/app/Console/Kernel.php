<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Envoyer rappels fin de stage tous les jours à 9h00
        $schedule->command('stages:rappel-fin')
                 ->dailyAt('09:00')
                 ->withoutOverlapping()
                 ->onOneServer();

        // Nettoyer les tokens expirés tous les dimanches à minuit
        $schedule->command('tokens:clean')
                 ->weekly()
                 ->sundays()
                 ->at('00:00')
                 ->withoutOverlapping();

        // Sauvegarder la base de données tous les jours à 2h00 (optionnel)
        // $schedule->command('backup:run')->dailyAt('02:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}