<?php

namespace App\Mail;

use App\Models\Stage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Address};
use Illuminate\Queue\SerializesModels;

class RappelFinStage extends Mailable
{
    use Queueable, SerializesModels;

    public $stage;
    public $type; // 'stagiaire' ou 'encadrant'

    /**
     * Create a new message instance.
     */
    public function __construct(Stage $stage, string $type)
    {
        $this->stage = $stage;
        $this->type = $type;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: '⏰ Rappel: Fin de stage dans 7 jours',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $stagiaire = $this->stage->candidature->stagiaire;
        $encadrant = $this->stage->encadrant;

        return new Content(
            view: 'emails.rappel-fin-stage',
            with: [
                'type' => $this->type,
                'nom_stagiaire' => $stagiaire->user->name,
                'nom_encadrant' => $encadrant->user->name,
                'titre_stage' => $this->stage->candidature->offre->titre,
                'date_fin' => $this->stage->date_fin_reelle->format('d/m/Y'),
                'jours_restants' => 7,
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