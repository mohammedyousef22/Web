<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $table = 'stages';

    protected $fillable = [
        'candidature_id',       // bigInteger FK unique - Référence vers candidatures
        'encadrant_id',         // bigInteger FK - Référence vers encadrants
        'date_debut_reelle',    // date - Date début effective du stage
        'date_fin_reelle',      // date - Date fin effective du stage
        'statut',               // enum('en_cours','termine','interrompu') - Statut stage
        'note_finale',          // decimal(4,2) nullable - Note /20
        'commentaire_final',    // text nullable - Commentaire final encadrant
        'attestation_path',     // string(255) nullable - Chemin attestation PDF
    ];

    protected $casts = [
        'date_debut_reelle' => 'date',
        'date_fin_reelle' => 'date',
        'note_finale' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function candidature()
    {
        return $this->belongsTo(Candidature::class);
    }

    public function encadrant()
    {
        return $this->belongsTo(Encadrant::class);
    }

    public function rapports()
    {
        return $this->hasMany(Rapport::class);
    }

    public function evaluation()
    {
        return $this->hasOne(Evaluation::class);
    }

    // Scopes
    public function scopeEnCours($query)
    {
        return $query->where('statut', 'en_cours');
    }

    public function scopeTermine($query)
    {
        return $query->where('statut', 'termine');
    }

    // Helpers
    public function isEnCours()
    {
        return $this->statut === 'en_cours';
    }

    public function isTermine()
    {
        return $this->statut === 'termine';
    }

    public function getDureeJours()
    {
        return $this->date_debut_reelle->diffInDays($this->date_fin_reelle);
    }

    public function getProgressPercentage()
    {
        $today = now();
        if ($today < $this->date_debut_reelle) return 0;
        if ($today > $this->date_fin_reelle) return 100;

        $total = $this->date_debut_reelle->diffInDays($this->date_fin_reelle);
        $elapsed = $this->date_debut_reelle->diffInDays($today);

        return round(($elapsed / $total) * 100, 1);
    }

    public function getJoursRestants()
    {
        if ($this->date_fin_reelle < now()) return 0;
        return now()->diffInDays($this->date_fin_reelle);
    }

    public function hasEvaluation()
    {
        return $this->evaluation()->exists();
    }

    public function hasAttestation()
    {
        return !is_null($this->attestation_path);
    }

    public function getAttestationUrl()
    {
        return $this->attestation_path ? asset('storage/' . $this->attestation_path) : null;
    }
}