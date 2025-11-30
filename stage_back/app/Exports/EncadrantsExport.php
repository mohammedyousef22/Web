<?php

namespace App\Exports;

use App\Models\Encadrant;
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

class EncadrantsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Récupérer la collection d'encadrants
     */
    public function collection()
    {
        $query = Encadrant::with(['user', 'departement'])
            ->withCount([
                'stages',
                'stages as stages_en_cours_count' => function($q) {
                    $q->where('statut', 'en_cours');
                },
                'stages as stages_termines_count' => function($q) {
                    $q->where('statut', 'termine');
                }
            ])
            ->withAvg('stages', 'note_finale');

        // Appliquer les filtres
        if (isset($this->filters['departement_id'])) {
            $query->where('departement_id', $this->filters['departement_id']);
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
            'Téléphone',
            'Département',
            'Spécialité',
            'Nombre Total Stagiaires',
            'Stages En Cours',
            'Stages Terminés',
            'Moyenne Notes Données',
            'Date Création',
            'Actif'
        ];
    }

    /**
     * Mapper les données
     */
    public function map($encadrant): array
    {
        return [
            $encadrant->id,
            $encadrant->user->name,
            $encadrant->user->email,
            $encadrant->telephone ?? 'N/A',
            $encadrant->departement->nom,
            $encadrant->specialite ?? 'N/A',
            $encadrant->stages_count,
            $encadrant->stages_en_cours_count,
            $encadrant->stages_termines_count,
            $encadrant->stages_avg_note_finale ? round($encadrant->stages_avg_note_finale, 2) . '/20' : 'N/A',
            $encadrant->created_at->format('d/m/Y'),
            $encadrant->user->is_active ? 'Oui' : 'Non'
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
                    'startColor' => ['rgb' => 'ea580c']
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
            'D' => 15, // Téléphone
            'E' => 25, // Département
            'F' => 25, // Spécialité
            'G' => 22, // Total Stagiaires
            'H' => 18, // En Cours
            'I' => 18, // Terminés
            'J' => 20, // Moyenne Notes
            'K' => 15, // Date Création
            'L' => 10, // Actif
        ];
    }
}