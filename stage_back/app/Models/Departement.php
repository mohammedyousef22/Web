<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    protected $table = 'departements';

    protected $fillable = [
        'nom',                  // string(255) unique - Nom département (Informatique, RH...)
        'description',          // text nullable - Description détaillée
        'responsable',          // string(255) nullable - Nom responsable département
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function encadrants()
    {
        return $this->hasMany(Encadrant::class);
    }

    public function offres()
    {
        return $this->hasMany(Offre::class);
    }

    // Helpers
    public function getActiveOffresCount()
    {
        return $this->offres()->where('statut', 'ouvert')->count();
    }

    public function getEncadrantsCount()
    {
        return $this->encadrants()->count();
    }
}