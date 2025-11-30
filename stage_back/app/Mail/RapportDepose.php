<?php

namespace App\Mail;

use App\Models\{Rapport, Stagiaire};
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class RapportDepose extends Mailable
{
    use Queueable, SerializesModels;

    public $rapport;
    public $stagiaire;
    public $stage;

    /**
     * Create a new message instance.
     */
    public function __construct(Rapport $rapport, Stagiaire $stagiaire)
    {
        $this->rapport = $rapport;
        $this->stagiaire = $stagiaire;
        $this->stage = $rapport->stage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: '📝 Nouveau rapport déposé - ' . $this->stagiaire->user->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.rapport-depose',
            with: [
                'encadrant' => $this->stage->encadrant,
                'stagiaire' => $this->stagiaire,
                'rapport' => $this->rapport,
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