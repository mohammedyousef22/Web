<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EncadrantResource extends JsonResource
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
            'user' => new UserResource($this->whenLoaded('user')),
            'departement' => [
                'id' => $this->departement->id ?? null,
                'nom' => $this->departement->nom ?? null,
            ],
            'specialite' => $this->specialite,
            'telephone' => $this->telephone,
            'stagiaires_count' => $this->when(isset($this->stages_count), $this->stages_count),
            // Removed 'stages' collection to avoid circular reference
            // Use separate endpoint to fetch encadrant stages if needed
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}