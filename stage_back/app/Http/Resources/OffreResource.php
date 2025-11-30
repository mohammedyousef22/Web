<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OffreResource extends JsonResource
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
            'titre' => $this->titre,
            'description' => $this->description,
            'departement' => [
                'id' => $this->departement->id ?? null,
                'nom' => $this->departement->nom ?? null,
            ],
            'duree_jours' => $this->duree_jours,
            'duree_mois' => $this->getDureeMois(),
            'date_debut' => $this->date_debut->format('Y-m-d'),
            'date_fin' => $this->date_fin->format('Y-m-d'),
            'competences_requises' => $this->competences_requises,
            'nombre_places' => $this->nombre_places,
            'places_restantes' => $this->getPlacesRestantes(),
            'statut' => $this->statut,
            'is_ouvert' => $this->isOuvert(),
            'created_by' => [
                'id' => $this->createur->id ?? null,
                'name' => $this->createur->name ?? null,
            ],
            'candidatures_count' => $this->when(isset($this->candidatures_count), $this->candidatures_count),
            // Removed 'candidatures' collection to avoid circular reference
            // Use separate endpoint GET /api/offres/{id}/candidatures to fetch candidatures if needed
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}