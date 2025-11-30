<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidatureResource extends JsonResource
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
            'offre' => new OffreResource($this->whenLoaded('offre')),
            'stagiaire' => new StagiaireResource($this->whenLoaded('stagiaire')),
            'lettre_motivation' => $this->lettre_motivation,
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'date_candidature' => $this->date_candidature->format('Y-m-d'),
            'date_reponse' => $this->date_reponse?->format('Y-m-d'),
            // Simplified stage to avoid circular reference
            'stage' => $this->when($this->relationLoaded('stage') && $this->stage !== null, function() {
                return [
                    'id' => $this->stage->id,
                    'statut' => $this->stage->statut,
                    'date_debut_reelle' => $this->stage->date_debut_reelle?->format('Y-m-d'),
                    'date_fin_reelle' => $this->stage->date_fin_reelle?->format('Y-m-d'),
                    'progression' => $this->stage->getProgressPercentage(),
                ];
            }),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get statut label in French
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'accepte' => 'Acceptée',
            'refuse' => 'Refusée',
            default => $this->statut
        };
    }
}