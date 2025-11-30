<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    protected $table = 'stagiaires';

    protected $fillable = [
        'user_id',              // bigInteger FK unique - Référence vers users
        'cin',                  // string(20) nullable - Numéro CIN
        'date_naissance',       // date nullable - Date de naissance
        'telephone',            // string(20) nullable - Numéro téléphone
        'etablissement',        // string(255) - Nom établissement (ENSA, Faculté...)
        'niveau_etude',         // string(100) - Niveau (Licence, Master, Doctorat...)
        'filiere',              // string(100) - Filière d'études
        'cv_path',              // string(255) nullable - Chemin fichier CV
        'adresse',              // text nullable - Adresse complète
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    public function stage()
    {
        return $this->hasOneThrough(
            Stage::class,
            Candidature::class,
            'stagiaire_id',  // FK sur candidatures
            'candidature_id', // FK sur stages
            'id',            // PK sur stagiaires
            'id'             // PK sur candidatures
        );
    }

    // Helpers
    public function hasActiveStage()
    {
        return $this->stage()->where('stages.statut', 'en_cours')->exists();
    }

    public function getCvUrl()
    {
        return $this->cv_path ? asset('storage/' . $this->cv_path) : null;
    }
}