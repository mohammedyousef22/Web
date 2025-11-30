<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departements = [
            [
                'nom' => 'Informatique',
                'description' => 'Département des technologies de l\'information et du développement logiciel. Responsable des projets web, mobile et systèmes d\'information.',
                'responsable' => 'Ahmed BENALI',
            ],
            [
                'nom' => 'Ressources Humaines',
                'description' => 'Département de gestion des ressources humaines, recrutement, formation et développement des compétences.',
                'responsable' => 'Fatima ZAHRI',
            ],
            [
                'nom' => 'Marketing',
                'description' => 'Département marketing digital et communication. Gestion des campagnes publicitaires et stratégies de marque.',
                'responsable' => 'Karim ALAMI',
            ],
            [
                'nom' => 'Finance',
                'description' => 'Département financier et comptabilité. Gestion budgétaire, contrôle de gestion et audit financier.',
                'responsable' => 'Samira IDRISSI',
            ],
            [
                'nom' => 'Logistique',
                'description' => 'Département logistique et gestion de la chaîne d\'approvisionnement. Coordination des opérations et transport.',
                'responsable' => 'Youssef TAZI',
            ],
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
