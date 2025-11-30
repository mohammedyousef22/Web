<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Encadrant extends Model
{
    protected $table = 'encadrants';

    protected $fillable = [
        'user_id',              // bigInteger FK unique - Référence vers users
        'departement_id',       // bigInteger FK - Référence vers departements
        'specialite',           // string(255) nullable - Spécialité (Dev web, RH...)
        'telephone',            // string(20) nullable - Numéro téléphone
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }

    // Helpers
    public function getActiveStagiairesCount()
    {
        return $this->stages()->where('statut', 'en_cours')->count();
    }

    public function getStagiaires()
    {
        return $this->stages()
            ->with('candidature.stagiaire.user')
            ->get()
            ->pluck('candidature.stagiaire');
    }
}