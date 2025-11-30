<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',                  // string(255) - Nom complet
        'email',                 // string(255) unique - Email
        'password',              // string(255) - Mot de passe hashé
        'role',                  // enum('admin','stagiaire','encadrant') - Rôle utilisateur
        'is_active',             // boolean default(1) - Compte actif ou non
        'email_verified_at',     // timestamp nullable - Date vérification email
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function stagiaire()
    {
        return $this->hasOne(Stagiaire::class);
    }

    public function encadrant()
    {
        return $this->hasOne(Encadrant::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isStagiaire()
    {
        return $this->role === 'stagiaire';
    }

    public function isEncadrant()
    {
        return $this->role === 'encadrant';
    }

    /**
     * Send the password reset notification for API
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}