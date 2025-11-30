<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $table = 'candidatures';

    protected $fillable = [
        'offre_id',             // bigInteger FK - Référence vers offres_stage
        'stagiaire_id',         // bigInteger FK - Référence vers stagiaires
        'lettre_motivation',    // text - Lettre de motivation du stagiaire
        'statut',               // enum('en_attente','accepte','refuse') - Statut candidature
        'date_candidature',     // date - Date de soumission candidature
        'date_reponse',         // date nullable - Date réponse admin
    ];

    protected $casts = [
        'date_candidature' => 'date',
        'date_reponse' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }

    public function stage()
    {
        return $this->hasOne(Stage::class);
    }

    // Scopes
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeAcceptee($query)
    {
        return $query->where('statut', 'accepte');
    }

    public function scopeRefusee($query)
    {
        return $query->where('statut', 'refuse');
    }

    // Helpers
    public function isEnAttente()
    {
        return $this->statut === 'en_attente';
    }

    public function isAcceptee()
    {
        return $this->statut === 'accepte';
    }

    public function isRefusee()
    {
        return $this->statut === 'refuse';
    }

    public function hasStage()
    {
        return $this->stage()->exists();
    }
}