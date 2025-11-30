<?php

namespace App\Mail;

use App\Models\{Stage, Evaluation};
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope, Attachment};
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class EvaluationDisponible extends Mailable
{
    use Queueable, SerializesModels;

    public $stage;
    public $evaluation;
    public $stagiaire;
    public $encadrant;

    /**
     * Create a new message instance.
     */
    public function __construct(Stage $stage, Evaluation $evaluation)
    {
        $this->stage = $stage;
        $this->evaluation = $evaluation;
        $this->stagiaire = $stage->candidature->stagiaire;
        $this->encadrant = $stage->encadrant;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎓 Votre évaluation de stage est disponible',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.evaluation-disponible',
            with: [
                'stagiaire' => $this->stagiaire,
                'encadrant' => $this->encadrant,
                'evaluation' => $this->evaluation,
                'stage' => $this->stage,
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
        // TODO: Fix attachment - for now, attestation is generated but not attached
        // User can download it from their dashboard
        return [];
    }
}
