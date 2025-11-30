<?php

namespace Database\Seeders;

use App\Models\Encadrant;
use App\Models\User;
use App\Models\Departement;
use Illuminate\Database\Seeder;

class EncadrantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les users de type encadrant
        $encadrantUsers = User::where('role', 'encadrant')->get();
        
        // Récupérer les départements
        $informatique = Departement::where('nom', 'Informatique')->first();
        $rh = Departement::where('nom', 'Ressources Humaines')->first();
        $marketing = Departement::where('nom', 'Marketing')->first();
        $finance = Departement::where('nom', 'Finance')->first();
        $logistique = Departement::where('nom', 'Logistique')->first();

        $encadrants = [
            [
                'user_id' => $encadrantUsers[0]->id, // Ahmed BENALI
                'departement_id' => $informatique->id,
                'specialite' => 'Développement Web & Mobile',
                'telephone' => '0612345678',
            ],
            [
                'user_id' => $encadrantUsers[1]->id, // Fatima ZAHRI
                'departement_id' => $rh->id,
                'specialite' => 'Gestion des Talents',
                'telephone' => '0612345679',
            ],
            [
                'user_id' => $encadrantUsers[2]->id, // Karim ALAMI
                'departement_id' => $marketing->id,
                'specialite' => 'Marketing Digital',
                'telephone' => '0612345680',
            ],
            [
                'user_id' => $encadrantUsers[3]->id, // Samira IDRISSI
                'departement_id' => $finance->id,
                'specialite' => 'Contrôle de Gestion',
                'telephone' => '0612345681',
            ],
            [
                'user_id' => $encadrantUsers[4]->id, // Youssef TAZI
                'departement_id' => $logistique->id,
                'specialite' => 'Supply Chain Management',
                'telephone' => '0612345682',
            ],
        ];

        foreach ($encadrants as $encadrant) {
            Encadrant::create($encadrant);
        }
    }
}
