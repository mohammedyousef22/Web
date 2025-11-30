<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StagiaireResource extends JsonResource
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
            'cin' => $this->cin,
            'date_naissance' => $this->date_naissance?->format('Y-m-d'),
            'telephone' => $this->telephone,
            'etablissement' => $this->etablissement,
            'niveau_etude' => $this->niveau_etude,
            'filiere' => $this->filiere,
            'adresse' => $this->adresse,
            'cv_path' => $this->cv_path,
            'cv_url' => $this->cv_path ? Storage::disk('public')->url($this->cv_path) : null,
            'has_cv' => !is_null($this->cv_path),
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
            'candidatures' => CandidatureResource::collection($this->whenLoaded('candidatures')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}