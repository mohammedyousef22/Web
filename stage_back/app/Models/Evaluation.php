<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $table = 'evaluations';

    protected $fillable = [
        'stage_id',             // bigInteger FK unique - Référence vers stages
        'note',                 // decimal(4,2) - Note finale /20
        'competences_acquises', // text nullable - Liste compétences acquises (JSON ou texte)
        'appreciation',         // text - Appréciation générale de l'encadrant
        'created_by',           // bigInteger FK - ID encadrant qui a créé l'évaluation
    ];

    protected $casts = [
        'note' => 'decimal:2',
        'competences_acquises' => 'array', // Stocké en JSON
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function encadrant()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Helpers
    public function getMention()
    {
        if ($this->note >= 16) return 'Très Bien';
        if ($this->note >= 14) return 'Bien';
        if ($this->note >= 12) return 'Assez Bien';
        if ($this->note >= 10) return 'Passable';
        return 'Insuffisant';
    }

    public function getNoteSur10()
    {
        return round($this->note / 2, 2);
    }

    public function hasCompetences()
    {
        return !empty($this->competences_acquises);
    }
}