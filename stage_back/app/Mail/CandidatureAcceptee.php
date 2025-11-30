<?php

namespace App\Mail;

use App\Models\{Candidature, Stage};
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class CandidatureAcceptee extends Mailable
{
    use Queueable, SerializesModels;

    public $candidature;
    public $stage;
    public $encadrant;
    public $stagiaire;
    public $offre;

    /**
     * Create a new message instance.
     */
    public function __construct(Candidature $candidature, Stage $stage)
    {
        $this->candidature = $candidature;
        $this->stage = $stage;
        $this->encadrant = $stage->encadrant;
        $this->stagiaire = $candidature->stagiaire;
        $this->offre = $candidature->offre;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: '🎉 Candidature acceptée - ' . $this->offre->titre,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.candidature-acceptee',
            with: [
                'stagiaire' => $this->stagiaire,
                'offre' => $this->offre,
                'stage' => $this->stage,
                'encadrant' => $this->encadrant,
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