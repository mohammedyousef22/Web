<?php

namespace Database\Seeders;

use App\Models\Offre;
use App\Models\Departement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OffreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer l'admin
        $admin = User::where('role', 'admin')->first();
        
        // Récupérer les départements
        $informatique = Departement::where('nom', 'Informatique')->first();
        $rh = Departement::where('nom', 'Ressources Humaines')->first();
        $marketing = Departement::where('nom', 'Marketing')->first();
        $finance = Departement::where('nom', 'Finance')->first();
        $logistique = Departement::where('nom', 'Logistique')->first();

        $offres = [
            // OFFRES OUVERTES (actives)
            [
                'titre' => 'Stage Développement Web Full Stack',
                'description' => 'Nous recherchons un stagiaire passionné pour rejoindre notre équipe de développement. Vous participerez au développement d\'applications web modernes en utilisant Laravel, Vue.js et MySQL. Vous serez impliqué dans toutes les phases du projet, de la conception à la mise en production.',
                'departement_id' => $informatique->id,
                'duree_jours' => 60,
                'date_debut' => Carbon::now()->addDays(15),
                'date_fin' => Carbon::now()->addDays(75),
                'competences_requises' => 'Laravel, PHP, JavaScript, Vue.js, MySQL, Git, API REST',
                'nombre_places' => 3,
                'statut' => 'ouvert',
                'created_by' => $admin->id,
            ],
            [
                'titre' => 'Stage Gestion des Ressources Humaines',
                'description' => 'Opportunité de stage au sein du département RH. Vous assisterez dans le recrutement, la formation du personnel et la gestion administrative. Excellente occasion de découvrir les métiers des ressources humaines dans une entreprise dynamique.',
                'departement_id' => $rh->id,
                'duree_jours' => 90,
                'date_debut' => Carbon::now()->addDays(20),
                'date_fin' => Carbon::now()->addDays(110),
                'competences_requises' => 'Communication, Bureautique (Excel, Word), Gestion du temps, Esprit d\'équipe',
                'nombre_places' => 2,
                'statut' => 'ouvert',
                'created_by' => $admin->id,
            ],
            [
                'titre' => 'Stage Marketing Digital & Réseaux Sociaux',
                'description' => 'Rejoignez notre équipe marketing pour gérer nos campagnes digitales. Vous créerez du contenu pour les réseaux sociaux, analyserez les performances et contribuerez à notre stratégie de communication en ligne.',
                'departement_id' => $marketing->id,
                'duree_jours' => 45,
                'date_debut' => Carbon::now()->addDays(10),
                'date_fin' => Carbon::now()->addDays(55),
                'competences_requises' => 'Social Media, Google Analytics, Adobe Creative Suite, Rédaction web, SEO',
                'nombre_places' => 2,
                'statut' => 'ouvert',
                'created_by' => $admin->id,
            ],
            
            // OFFRES FERMÉES
            [
                'titre' => 'Stage Contrôle de Gestion Financière',
                'description' => 'Stage au département finance pour assister dans l\'élaboration des budgets, le suivi des indicateurs de performance et la préparation des reportings financiers mensuels.',
                'departement_id' => $finance->id,
                'duree_jours' => 60,
                'date_debut' => Carbon::now()->subDays(10),
                'date_fin' => Carbon::now()->addDays(50),
                'competences_requises' => 'Excel avancé, Comptabilité, Analyse financière, PowerPoint',
                'nombre_places' => 1,
                'statut' => 'ferme',
                'created_by' => $admin->id,
            ],
            [
                'titre' => 'Stage Logistique et Supply Chain',
                'description' => 'Participation aux opérations logistiques quotidiennes, gestion des stocks, coordination des livraisons et optimisation des processus de la chaîne d\'approvisionnement.',
                'departement_id' => $logistique->id,
                'duree_jours' => 75,
                'date_debut' => Carbon::now()->subDays(30),
                'date_fin' => Carbon::now()->addDays(45),
                'competences_requises' => 'Gestion des stocks, Planification, SAP ou ERP, Organisation',
                'nombre_places' => 2,
                'statut' => 'ferme',
                'created_by' => $admin->id,
            ],
        ];

        foreach ($offres as $offre) {
            Offre::create($offre);
        }
    }
}
