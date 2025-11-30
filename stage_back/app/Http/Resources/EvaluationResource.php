<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationResource extends JsonResource
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
            'stage_id' => $this->stage_id,
            'note' => $this->note,
            'note_sur_10' => $this->getNoteSur10(),
            'mention' => $this->getMention(),
            'competences_acquises' => is_array($this->competences_acquises) 
                ? $this->competences_acquises 
                : ($this->competences_acquises ? json_decode($this->competences_acquises, true) : null),
            'appreciation' => $this->appreciation,
            'created_by' => [
                'id' => $this->encadrant->id ?? null,
                'name' => $this->encadrant->name ?? null,
            ],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}