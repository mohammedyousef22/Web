<?php

namespace Database\Seeders;

use App\Models\Candidature;
use App\Models\Offre;
use App\Models\Stagiaire;
use App\Models\Stage;
use App\Models\Encadrant;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CandidatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les offres
        $offreWeb = Offre::where('titre', 'LIKE', '%Développement Web%')->first();
        $offreRH = Offre::where('titre', 'LIKE', '%Ressources Humaines%')->first();
        $offreMarketing = Offre::where('titre', 'LIKE', '%Marketing Digital%')->first();
        $offreFinance = Offre::where('titre', 'LIKE', '%Contrôle de Gestion%')->first();
        $offreLogistique = Offre::where('titre', 'LIKE', '%Logistique%')->first();

        // Récupérer les stagiaires
        $stagiaires = Stagiaire::all();

        $candidatures = [
            // ===== CANDIDATURES EN ATTENTE =====
            [
                'offre_id' => $offreWeb->id,
                'stagiaire_id' => $stagiaires[0]->id, // Omar JALAL
                'lettre_motivation' => 'Madame, Monsieur,

Actuellement étudiant en 5ème année à l\'ENSIAS, je suis vivement intéressé par votre offre de stage en développement web full stack. Passionné par les technologies web modernes, j\'ai développé plusieurs projets personnels utilisant Laravel et Vue.js.

Je serais honoré de mettre mes compétences au service de votre équipe et d\'approfondir mes connaissances dans un environnement professionnel enrichissant.

Cordialement,
Omar JALAL',
                'statut' => 'en_attente',
                'date_candidature' => Carbon::now()->subDays(3),
            ],
            [
                'offre_id' => $offreRH->id,
                'stagiaire_id' => $stagiaires[1]->id, // Amina BERRADA
                'lettre_motivation' => 'Madame, Monsieur,

Étudiante en Master Management des Ressources Humaines à l\'ISCAE, je souhaite intégrer votre département RH pour un stage de 3 mois. Mon parcours académique et mes expériences associatives m\'ont permis de développer d\'excellentes compétences en communication et en gestion d\'équipe.

Je suis motivée à contribuer activement aux projets de votre département.

Respectueusement,
Amina BERRADA',
                'statut' => 'en_attente',
                'date_candidature' => Carbon::now()->subDays(2),
            ],
            [
                'offre_id' => $offreMarketing->id,
                'stagiaire_id' => $stagiaires[3]->id, // Salma CHAKIR
                'lettre_motivation' => 'Madame, Monsieur,

Passionnée par le marketing digital et la communication, je candidate pour le poste de stagiaire au sein de votre département marketing. Ma formation à l\'ENCG et mes compétences en création de contenu et gestion des réseaux sociaux me permettront d\'être rapidement opérationnelle.

J\'ai hâte de contribuer à vos campagnes digitales.

Cordialement,
Salma CHAKIR',
                'statut' => 'en_attente',
                'date_candidature' => Carbon::now()->subDays(1),
            ],
            [
                'offre_id' => $offreWeb->id,
                'stagiaire_id' => $stagiaires[2]->id, // Hassan MOUSSAOUI
                'lettre_motivation' => 'Madame, Monsieur,

Ingénieur en Réseaux et Télécommunications à l\'INPT, je possède également de solides compétences en développement web. Votre offre m\'intéresse particulièrement car elle combine développement backend et frontend, deux domaines que je maîtrise.

Je suis disponible immédiatement pour un stage de 2 mois.

Bien cordialement,
Hassan MOUSSAOUI',
                'statut' => 'en_attente',
                'date_candidature' => Carbon::now()->subDays(5),
            ],

            // ===== CANDIDATURES ACCEPTÉES (avec stages créés) =====
            [
                'offre_id' => $offreFinance->id,
                'stagiaire_id' => $stagiaires[4]->id, // Rachid BENJELLOUN
                'lettre_motivation' => 'Madame, Monsieur,

Étudiant en Master Finance et Comptabilité, je suis très intéressé par votre offre de stage en contrôle de gestion. Mon expérience en analyse financière et ma maîtrise d\'Excel me rendront rapidement autonome.

Merci pour votre considération.

Rachid BENJELLOUN',
                'statut' => 'accepte',
                'date_candidature' => Carbon::now()->subDays(20),
                'date_reponse' => Carbon::now()->subDays(15),
            ],
            [
                'offre_id' => $offreLogistique->id,
                'stagiaire_id' => $stagiaires[7]->id, // Leila HAMDAOUI
                'lettre_motivation' => 'Madame, Monsieur,

Passionnée par la logistique et le supply chain management, je candidate pour rejoindre votre équipe. Mon cursus à l\'ENSAM m\'a fourni de solides bases en gestion des opérations.

Je suis motivée et rigoureuse.

Leila HAMDAOUI',
                'statut' => 'accepte',
                'date_candidature' => Carbon::now()->subDays(35),
                'date_reponse' => Carbon::now()->subDays(30),
            ],
            [
                'offre_id' => $offreWeb->id,
                'stagiaire_id' => $stagiaires[8]->id, // Amine TAHIRI
                'lettre_motivation' => 'Madame, Monsieur,

Développeur full stack formé à l\'école 1337, je maîtrise JavaScript, PHP et les frameworks modernes. Votre offre correspond parfaitement à mon profil et à mes aspirations professionnelles.

Disponible immédiatement.

Amine TAHIRI',
                'statut' => 'accepte',
                'date_candidature' => Carbon::now()->subDays(25),
                'date_reponse' => Carbon::now()->subDays(20),
            ],

            // ===== CANDIDATURES REFUSÉES =====
            [
                'offre_id' => $offreMarketing->id,
                'stagiaire_id' => $stagiaires[5]->id, // Nadia EL FASSI
                'lettre_motivation' => 'Madame, Monsieur,

Intéressée par le domaine du marketing, je souhaite effectuer mon stage au sein de votre entreprise pour développer mes compétences.

Cordialement,
Nadia EL FASSI',
                'statut' => 'refuse',
                'date_candidature' => Carbon::now()->subDays(30),
                'date_reponse' => Carbon::now()->subDays(28),
            ],
            [
                'offre_id' => $offreRH->id,
                'stagiaire_id' => $stagiaires[6]->id, // Mehdi CHRAIBI
                'lettre_motivation' => 'Candidature spontanée pour stage RH. Motivé et sérieux.

Mehdi CHRAIBI',
                'statut' => 'refuse',
                'date_candidature' => Carbon::now()->subDays(40),
                'date_reponse' => Carbon::now()->subDays(38),
            ],
        ];

        foreach ($candidatures as $candidatureData) {
            $candidature = Candidature::create($candidatureData);

            // Créer les stages pour les candidatures acceptées
            if ($candidature->statut === 'accepte') {
                $this->createStageForCandidature($candidature);
            }
        }
    }

    /**
     * Créer un stage pour une candidature acceptée
     */
    private function createStageForCandidature(Candidature $candidature)
    {
        // Récupérer un encadrant du même département que l'offre
        $encadrant = Encadrant::where('departement_id', $candidature->offre->departement_id)->first();

        if (!$encadrant) {
            // Fallback: prendre premier encadrant disponible
            $encadrant = Encadrant::first();
        }

        $offre = $candidature->offre;
        $status = Carbon::now()->lt($offre->date_fin) ? 'en_cours' : 'termine';

        Stage::create([
            'candidature_id' => $candidature->id,
            'encadrant_id' => $encadrant->id,
            'date_debut_reelle' => $offre->date_debut,
            'date_fin_reelle' => $offre->date_fin,
            'statut' => $status,
            'note_finale' => $status === 'termine' ? 16.5 : null,
            'commentaire_final' => $status === 'termine' ? 'Excellent travail, investissement remarquable.' : null,
        ]);
    }
}
