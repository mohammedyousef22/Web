<?php

namespace App\Mail;

use App\Models\{Stagiaire, Stage};
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class NouveauStagiaire extends Mailable
{
    use Queueable, SerializesModels;

    public $stagiaire;
    public $stage;
    public $offre;

    /**
     * Create a new message instance.
     */
    public function __construct(Stagiaire $stagiaire, Stage $stage)
    {
        $this->stagiaire = $stagiaire;
        $this->stage = $stage;
        $this->offre = $stage->candidature->offre;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: 'Nouveau stagiaire assigné - ' . $this->stagiaire->user->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.nouveau-stagiaire',
            with: [
                'encadrant' => $this->stage->encadrant,
                'stagiaire' => $this->stagiaire,
                'stage' => $this->stage,
                'offre' => $this->offre,
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