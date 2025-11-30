<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    protected $table = 'offres';

    protected $fillable = [
        'titre',                    // string(255) - Titre de l'offre
        'description',              // text - Description détaillée du stage
        'departement_id',           // bigInteger FK - Référence vers departements
        'duree_jours',              // integer - Durée en jours (ex: 60)
        'date_debut',               // date - Date début stage
        'date_fin',                 // date - Date fin stage
        'competences_requises',     // text - Compétences demandées
        'nombre_places',            // integer - Nombre de places disponibles
        'statut',                   // enum('ouvert','ferme') - Statut de l'offre
        'created_by',               // bigInteger FK - ID admin qui a créé l'offre
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'duree_jours' => 'integer',
        'nombre_places' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    // Scopes
    public function scopeOuvert($query)
    {
        return $query->where('statut', 'ouvert');
    }

    public function scopeFerme($query)
    {
        return $query->where('statut', 'ferme');
    }

    // Helpers
    public function getPlacesRestantes()
    {
        $acceptees = $this->candidatures()->where('statut', 'accepte')->count();
        return $this->nombre_places - $acceptees;
    }

    public function isOuvert()
    {
        return $this->statut === 'ouvert';
    }

    public function getCandidaturesCount()
    {
        return $this->candidatures()->count();
    }

    public function getDureeMois()
    {
        return round($this->duree_jours / 30, 1);
    }
}