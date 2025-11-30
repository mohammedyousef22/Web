<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    protected $table = 'rapports';

    protected $fillable = [
        'stage_id',             // bigInteger FK - Référence vers stages
        'type',                 // enum('intermediaire','final') - Type de rapport
        'titre',                // string(255) - Titre du rapport
        'fichier_path',         // string(255) - Chemin fichier PDF
        'date_depot',           // date - Date dépôt rapport
        'statut',               // enum('en_attente','valide','a_corriger') - Statut validation
        'commentaire_encadrant',// text nullable - Commentaire encadrant
        'date_validation',      // date nullable - Date validation/correction
    ];

    protected $casts = [
        'date_depot' => 'date',
        'date_validation' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    // Scopes
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeValide($query)
    {
        return $query->where('statut', 'valide');
    }

    public function scopeACorriger($query)
    {
        return $query->where('statut', 'a_corriger');
    }

    public function scopeIntermediaire($query)
    {
        return $query->where('type', 'intermediaire');
    }

    public function scopeFinal($query)
    {
        return $query->where('type', 'final');
    }

    // Helpers
    public function isEnAttente()
    {
        return $this->statut === 'en_attente';
    }

    public function isValide()
    {
        return $this->statut === 'valide';
    }

    public function isACorriger()
    {
        return $this->statut === 'a_corriger';
    }

    public function isIntermediaire()
    {
        return $this->type === 'intermediaire';
    }

    public function isFinal()
    {
        return $this->type === 'final';
    }

    public function getFichierUrl()
    {
        return $this->fichier_path ? asset('storage/' . $this->fichier_path) : null;
    }

    public function getJoursDepuisDepot()
    {
        return $this->date_depot->diffInDays(now());
    }

    public function isUrgent()
    {
        return $this->isEnAttente() && $this->getJoursDepuisDepot() > 7;
    }
}