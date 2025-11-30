<?php

namespace App\Exports;

use App\Models\Stage;
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

class StagesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Récupérer la collection de stages
     */
    public function collection()
    {
        $query = Stage::with([
            'candidature.stagiaire.user',
            'candidature.offre.departement',
            'encadrant.user',
            'evaluation',
            'rapports'
        ]);

        // Appliquer les filtres
        if (isset($this->filters['statut'])) {
            $query->where('statut', $this->filters['statut']);
        }

        if (isset($this->filters['date_debut'])) {
            $query->whereDate('date_debut_reelle', '>=', $this->filters['date_debut']);
        }

        if (isset($this->filters['date_fin'])) {
            $query->whereDate('date_fin_reelle', '<=', $this->filters['date_fin']);
        }

        if (isset($this->filters['departement_id'])) {
            $query->whereHas('candidature.offre', function($q) {
                $q->where('departement_id', $this->filters['departement_id']);
            });
        }

        return $query->orderBy('date_debut_reelle', 'desc')->get();
    }

    /**
     * Définir les en-têtes de colonnes
     */
    public function headings(): array
    {
        return [
            'ID Stage',
            'Stagiaire',
            'Email Stagiaire',
            'Établissement',
            'Filière',
            'Titre Stage',
            'Département',
            'Encadrant',
            'Email Encadrant',
            'Date Début',
            'Date Fin',
            'Durée (jours)',
            'Statut',
            'Rapports Déposés',
            'Rapports Validés',
            'Note Finale',
            'Mention',
            'A Attestation'
        ];
    }

    /**
     * Mapper les données
     */
    public function map($stage): array
    {
        $stagiaire = $stage->candidature->stagiaire;
        $offre = $stage->candidature->offre;
        $encadrant = $stage->encadrant;

        return [
            $stage->id,
            $stagiaire->user->name,
            $stagiaire->user->email,
            $stagiaire->etablissement,
            $stagiaire->filiere,
            $offre->titre,
            $offre->departement->nom,
            $encadrant->user->name,
            $encadrant->user->email,
            $stage->date_debut_reelle->format('d/m/Y'),
            $stage->date_fin_reelle->format('d/m/Y'),
            $stage->getDureeJours(),
            $this->getStatutLabel($stage->statut),
            $stage->rapports->count(),
            $stage->rapports->where('statut', 'valide')->count(),
            $stage->note_finale ? $stage->note_finale . '/20' : 'N/A',
            $stage->evaluation ? $stage->evaluation->getMention() : 'N/A',
            $stage->hasAttestation() ? 'Oui' : 'Non'
        ];
    }

    /**
     * Styles pour le fichier Excel
     */
    public function styles(Worksheet $sheet)
    {
        // Appliquer des couleurs conditionnelles selon le statut
        $lastRow = $sheet->getHighestRow();
        
        for ($row = 2; $row <= $lastRow; $row++) {
            $statut = $sheet->getCell('M' . $row)->getValue();
            
            switch ($statut) {
                case 'En cours':
                    $color = 'C6F6D5'; // Vert clair
                    break;
                case 'Terminé':
                    $color = 'BEE3F8'; // Bleu clair
                    break;
                case 'Interrompu':
                    $color = 'FED7D7'; // Rouge clair
                    break;
                default:
                    $color = 'FFFFFF';
            }
            
            $sheet->getStyle('M' . $row)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setRGB($color);
        }

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
                    'startColor' => ['rgb' => '059669']
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
            'A' => 10, // ID
            'B' => 25, // Stagiaire
            'C' => 30, // Email Stagiaire
            'D' => 30, // Établissement
            'E' => 25, // Filière
            'F' => 35, // Titre Stage
            'G' => 20, // Département
            'H' => 25, // Encadrant
            'I' => 30, // Email Encadrant
            'J' => 15, // Date Début
            'K' => 15, // Date Fin
            'L' => 12, // Durée
            'M' => 15, // Statut
            'N' => 18, // Rapports Déposés
            'O' => 18, // Rapports Validés
            'P' => 12, // Note
            'Q' => 15, // Mention
            'R' => 15, // Attestation
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