<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Users (admin + encadrants + stagiaires)
            UserSeeder::class,
            
            // 2. Départements
            DepartementSeeder::class,
            
            // 3. Profils encadrants (dépend de users + départements)
            EncadrantSeeder::class,
            
            // 4. Profils stagiaires (dépend de users)
            StagiaireSeeder::class,
            
            // 5. Offres de stage (dépend de départements + admin)
            OffreSeeder::class,
            
            // 6. Candidatures + Stages (dépend de offres + stagiaires + encadrants)
            CandidatureSeeder::class,
        ]);

        $this->command->info('✅ Base de données seedée avec succès!');
        $this->command->info('');
        $this->command->info('📊 Données créées:');
        $this->command->info('   - 1 Administrateur');
        $this->command->info('   - 5 Encadrants');
        $this->command->info('   - 10 Stagiaires');
        $this->command->info('   - 5 Départements');
        $this->command->info('   - 5 Offres de stage (3 ouvertes, 2 fermées)');
        $this->command->info('   - 9 Candidatures (4 en attente, 3 acceptées, 2 refusées)');
        $this->command->info('   - 3 Stages créés automatiquement');
        $this->command->info('');
        $this->command->info('🔑 Identifiants de connexion:');
        $this->command->info('   Admin: admin@stages.ma / admin123');
        $this->command->info('   Encadrant: ahmed.benali@entreprise.ma / password123');
        $this->command->info('   Stagiaire: omar.jalal@gmail.com / password123');
    }
}
