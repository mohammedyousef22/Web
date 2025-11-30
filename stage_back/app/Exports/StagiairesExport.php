<?php

namespace App\Exports;

use App\Models\Stagiaire;
use Maatwebsite\Excel\Concerns\{
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithColumnWidths,
    ShouldAutoSize
};
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class StagiairesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Récupérer la collection de stagiaires
     */
    public function collection()
    {
        $query = Stagiaire::with([
            'user',
            'stage.encadrant.user',
            'stage.candidature.offre',
            'stage.evaluation'
        ]);

        // Appliquer les filtres
        if (isset($this->filters['etablissement'])) {
            $query->where('etablissement', 'LIKE', "%{$this->filters['etablissement']}%");
        }

        if (isset($this->filters['filiere'])) {
            $query->where('filiere', 'LIKE', "%{$this->filters['filiere']}%");
        }

        if (isset($this->filters['niveau_etude'])) {
            $query->where('niveau_etude', $this->filters['niveau_etude']);
        }

        return $query->get();
    }

    /**
     * Définir les en-têtes de colonnes
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nom Complet',
            'Email',
            'CIN',
            'Téléphone',
            'Établissement',
            'Niveau d\'Étude',
            'Filière',
            'A un Stage',
            'Statut Stage',
            'Titre Stage',
            'Encadrant',
            'Date Début',
            'Date Fin',
            'Note Finale',
            'Date Inscription'
        ];
    }

    /**
     * Mapper les données
     */
    public function map($stagiaire): array
    {
        return [
            $stagiaire->id,
            $stagiaire->user->name,
            $stagiaire->user->email,
            $stagiaire->cin ?? 'N/A',
            $stagiaire->telephone ?? 'N/A',
            $stagiaire->etablissement,
            $stagiaire->niveau_etude,
            $stagiaire->filiere,
            $stagiaire->stage ? 'Oui' : 'Non',
            $stagiaire->stage ? $this->getStatutLabel($stagiaire->stage->statut) : 'N/A',
            $stagiaire->stage ? $stagiaire->stage->candidature->offre->titre : 'N/A',
            $stagiaire->stage ? $stagiaire->stage->encadrant->user->name : 'N/A',
            $stagiaire->stage ? $stagiaire->stage->date_debut_reelle->format('d/m/Y') : 'N/A',
            $stagiaire->stage ? $stagiaire->stage->date_fin_reelle->format('d/m/Y') : 'N/A',
            $stagiaire->stage && $stagiaire->stage->note_finale ? $stagiaire->stage->note_finale . '/20' : 'N/A',
            $stagiaire->created_at->format('d/m/Y')
        ];
    }

    /**
     * Styles pour le fichier Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style pour l'en-tête (ligne 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1e40af']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ],
        ];
    }

    /**
     * Définir la largeur des colonnes
     */
    public function columnWidths(): array
    {
        return [
            'A' => 8,  // ID
            'B' => 25, // Nom
            'C' => 30, // Email
            'D' => 15, // CIN
            'E' => 15, // Téléphone
            'F' => 30, // Établissement
            'G' => 20, // Niveau
            'H' => 25, // Filière
            'I' => 12, // A un Stage
            'J' => 15, // Statut Stage
            'K' => 35, // Titre Stage
            'L' => 25, // Encadrant
            'M' => 15, // Date Début
            'N' => 15, // Date Fin
            'O' => 12, // Note
            'P' => 15, // Date Inscription
        ];
    }

    /**
     * Helper pour obtenir le label du statut
     */
    private function getStatutLabel($statut): string
    {
        return match($statut) {
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'interrompu' => 'Interrompu',
            default => $statut
        };
    }
}