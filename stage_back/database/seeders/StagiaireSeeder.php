<?php

namespace Database\Seeders;

use App\Models\Stagiaire;
use App\Models\User;
use Illuminate\Database\Seeder;

class StagiaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les users de type stagiaire
        $stagiaireUsers = User::where('role', 'stagiaire')->get();

        $stagiaires = [
            [
                'user_id' => $stagiaireUsers[0]->id, // Omar JALAL
                'cin' => 'BK123456',
                'date_naissance' => '2001-05-15',
                'telephone' => '0698765432',
                'etablissement' => 'ENSIAS - École Nationale Supérieure d\'Informatique',
                'niveau_etude' => 'bac+5',
                'filiere' => 'Génie Logiciel',
                'cv_path' => 'cv/omar_jalal_cv.pdf',
                'adresse' => 'Hay Riad, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[1]->id, // Amina BERRADA
                'cin' => 'BK234567',
                'date_naissance' => '2002-03-22',
                'telephone' => '0698765433',
                'etablissement' => 'ISCAE - Institut Supérieur de Commerce',
                'niveau_etude' => 'master',
                'filiere' => 'Management des Ressources Humaines',
                'cv_path' => 'cv/amina_berrada_cv.pdf',
                'adresse' => 'Agdal, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[2]->id, // Hassan MOUSSAOUI
                'cin' => 'BK345678',
                'date_naissance' => '2000-11-08',
                'telephone' => '0698765434',
                'etablissement' => 'INPT - Institut National des Postes et Télécommunications',
                'niveau_etude' => 'ingenieur',
                'filiere' => 'Réseaux et Télécommunications',
                'cv_path' => 'cv/hassan_moussaoui_cv.pdf',
                'adresse' => 'Hay Nahda, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[3]->id, // Salma CHAKIR
                'cin' => 'BK456789',
                'date_naissance' => '2002-07-19',
                'telephone' => '0698765435',
                'etablissement' => 'ENCG - École Nationale de Commerce et Gestion',
                'niveau_etude' => 'licence',
                'filiere' => 'Marketing et Communication',
                'cv_path' => 'cv/salma_chakir_cv.pdf',
                'adresse' => 'Hassan, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[4]->id, // Rachid BENJELLOUN
                'cin' => 'BK567890',
                'date_naissance' => '2001-09-12',
                'telephone' => '0698765436',
                'etablissement' => 'FSJES - Faculté des Sciences Juridiques Économiques et Sociales',
                'niveau_etude' => 'master',
                'filiere' => 'Finance et Comptabilité',
                'cv_path' => 'cv/rachid_benjelloun_cv.pdf',
                'adresse' => 'Souissi, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[5]->id, // Nadia EL FASSI
                'cin' => 'BK678901',
                'date_naissance' => '2003-01-28',
                'telephone' => '0698765437',
                'etablissement' => 'Université Mohammed V',
                'niveau_etude' => 'bac+3',
                'filiere' => 'Sciences de Gestion',
                'cv_path' => 'cv/nadia_elfassi_cv.pdf',
                'adresse' => 'Hay Saada, Salé',
            ],
            [
                'user_id' => $stagiaireUsers[6]->id, // Mehdi CHRAIBI
                'cin' => 'BK789012',
                'date_naissance' => '2001-06-05',
                'telephone' => '0698765438',
                'etablissement' => 'EMI - École Mohammadia d\'Ingénieurs',
                'niveau_etude' => 'ingenieur',
                'filiere' => 'Génie Industriel',
                'cv_path' => 'cv/mehdi_chraibi_cv.pdf',
                'adresse' => 'Agdal, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[7]->id, // Leila HAMDAOUI
                'cin' => 'BK890123',
                'date_naissance' => '2002-12-14',
                'telephone' => '0698765439',
                'etablissement' => 'ENSAM - École Nationale Supérieure d\'Arts et Métiers',
                'niveau_etude' => 'bac+4',
                'filiere' => 'Logistique et Transport',
                'cv_path' => 'cv/leila_hamdaoui_cv.pdf',
                'adresse' => 'Hay Riad, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[8]->id, // Amine TAHIRI
                'cin' => 'BK901234',
                'date_naissance' => '2001-04-25',
                'telephone' => '0698765440',
                'etablissement' => '1337 - École de Codage',
                'niveau_etude' => 'bac+2',
                'filiere' => 'Développement Full Stack',
                'cv_path' => 'cv/amine_tahiri_cv.pdf',
                'adresse' => 'Océan, Rabat',
            ],
            [
                'user_id' => $stagiaireUsers[9]->id, // Zineb LAMRANI
                'cin' => 'BK012345',
                'date_naissance' => '2002-10-30',
                'telephone' => '0698765441',
                'etablissement' => 'ENSA - École Nationale des Sciences Appliquées',
                'niveau_etude' => 'ingenieur',
                'filiere' => 'Business Intelligence',
                'cv_path' => 'cv/zineb_lamrani_cv.pdf',
                'adresse' => 'Hay Nahda, Rabat',
            ],
        ];

        foreach ($stagiaires as $stagiaire) {
            Stagiaire::create($stagiaire);
        }
    }
}
