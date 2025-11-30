<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class WelcomeEncadrant extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $tempPassword;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $tempPassword)
    {
        $this->user = $user;
        $this->tempPassword = $tempPassword;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: 'Bienvenue sur la plateforme - Vos identifiants',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Charger l'encadrant avec les relations
        $encadrant = \App\Models\Encadrant::with(['user', 'departement'])
            ->where('user_id', $this->user->id)
            ->first();

        return new Content(
            view: 'emails.welcome-encadrant',
            with: [
                'encadrant' => $encadrant,
                'temporaryPassword' => $this->tempPassword,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}