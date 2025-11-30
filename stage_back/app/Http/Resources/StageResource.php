<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StageResource extends JsonResource
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
            // Simplified candidature to avoid circular reference
            'candidature' => $this->when($this->relationLoaded('candidature'), [
                'id' => $this->candidature->id ?? null,
                'statut' => $this->candidature->statut ?? null,
                'date_candidature' => $this->candidature->date_candidature?->format('Y-m-d'),
                'offre' => $this->when($this->candidature && $this->candidature->relationLoaded('offre'), [
                    'id' => $this->candidature->offre->id ?? null,
                    'titre' => $this->candidature->offre->titre ?? null,
                ]),
                'stagiaire' => $this->when($this->candidature && $this->candidature->relationLoaded('stagiaire'), [
                    'id' => $this->candidature->stagiaire->id ?? null,
                    'user' => $this->when($this->candidature->stagiaire->relationLoaded('user'), [
                        'id' => $this->candidature->stagiaire->user->id ?? null,
                        'name' => $this->candidature->stagiaire->user->name ?? null,
                        'email' => $this->candidature->stagiaire->user->email ?? null,
                    ]),
                ]),
            ]),
            'encadrant' => new EncadrantResource($this->whenLoaded('encadrant')),
            'date_debut_reelle' => $this->date_debut_reelle->format('Y-m-d'),
            'date_fin_reelle' => $this->date_fin_reelle->format('Y-m-d'),
            'duree_jours' => $this->getDureeJours(),
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'note_finale' => $this->note_finale,
            'commentaire_final' => $this->commentaire_final,
            'attestation_path' => $this->attestation_path,
            'attestation_url' => $this->getAttestationUrl(),
            'has_attestation' => $this->hasAttestation(),
            'progression' => $this->getProgressPercentage(),
            'jours_restants' => $this->getJoursRestants(),
            'is_en_cours' => $this->isEnCours(),
            'is_termine' => $this->isTermine(),
            'rapports' => RapportResource::collection($this->whenLoaded('rapports')),
            'evaluation' => new EvaluationResource($this->whenLoaded('evaluation')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get statut label in French
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'interrompu' => 'Interrompu',
            default => $this->statut
        };
    }
}