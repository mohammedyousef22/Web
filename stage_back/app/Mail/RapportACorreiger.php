<?php

namespace App\Mail;

use App\Models\Rapport;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class RapportACorreiger extends Mailable
{
    use Queueable, SerializesModels;

    public $rapport;
    public $encadrant;

    /**
     * Create a new message instance.
     */
    public function __construct(Rapport $rapport)
    {
        $this->rapport = $rapport;
        $this->encadrant = $rapport->stage->encadrant;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: '⚠️ Corrections demandées - ' . $this->rapport->titre,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.rapport-a-corriger',
            with: [
                'stagiaire' => $this->rapport->stage->candidature->stagiaire,
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