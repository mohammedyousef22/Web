<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartementResource extends JsonResource
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
            'nom' => $this->nom,
            'description' => $this->description,
            'responsable' => $this->responsable,
            'encadrants_count' => $this->when(isset($this->encadrants_count), $this->encadrants_count),
            'offres_count' => $this->when(isset($this->offres_count), $this->offres_count),
            'encadrants' => EncadrantResource::collection($this->whenLoaded('encadrants')),
            'offres' => OffreResource::collection($this->whenLoaded('offres')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}