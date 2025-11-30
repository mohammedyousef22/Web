<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class RapportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stage' => [
                'id' => $this->stage->id ?? null,
                'stagiaire_name' => $this->stage->candidature->stagiaire->user->name ?? null,
                'offre_titre' => $this->stage->candidature->offre->titre ?? null,
            ],
            'type' => $this->type,
            'type_label' => $this->getTypeLabel(),
            'titre' => $this->titre,
            'fichier_path' => $this->fichier_path,
            'fichier_url' => $this->getFichierUrl(),
            'date_depot' => $this->date_depot->format('Y-m-d'),
            'jours_depuis_depot' => $this->getJoursDepuisDepot(),
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'commentaire_encadrant' => $this->commentaire_encadrant,
            'date_validation' => $this->date_validation?->format('Y-m-d'),
            'is_urgent' => $this->isUrgent(),
            'is_en_attente' => $this->isEnAttente(),
            'is_valide' => $this->isValide(),
            'is_a_corriger' => $this->isACorriger(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get type label in French
     */
    private function getTypeLabel(): string
    {
        return match($this->type) {
            'intermediaire' => 'Intermédiaire',
            'final' => 'Final',
            default => $this->type
        };
    }

    /**
     * Get statut label in French
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'valide' => 'Validé',
            'a_corriger' => 'À corriger',
            default => $this->statut
        };
    }
}