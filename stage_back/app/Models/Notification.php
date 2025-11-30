<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',              // bigInteger FK - Référence vers users
        'type',                 // string(100) - Type notification (candidature_acceptee, rapport_depose...)
        'titre',                // string(255) - Titre court notification
        'message',              // text - Message détaillé
        'is_read',              // boolean default(0) - Notification lue ou non
        'lien',                 // string(255) nullable - URL vers action concernée
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Helpers
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    public function isRead()
    {
        return $this->is_read;
    }

    public function getTimeAgo()
    {
        return $this->created_at->diffForHumans();
    }

    public function hasLink()
    {
        return !is_null($this->lien);
    }
}