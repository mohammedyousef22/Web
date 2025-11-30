<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #ffc107; color: #333; padding: 20px; border-radius: 8px; text-align: center; margin: -30px -30px 20px -30px; }
        .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .comment-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #dee2e6; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Corrections Demandées</h1>
        </div>

        <p>Bonjour <strong>{{ $stagiaire->user->name }}</strong>,</p>

        <div class="warning-box">
            <p style="margin:0; font-weight: bold;">
                Votre encadrant vous demande d'apporter des corrections à votre rapport "{{ $rapport->titre }}".
            </p>
        </div>

        <h3>💬 Commentaires de l'encadrant :</h3>
        <div class="comment-box">
            <p style="margin:0; white-space: pre-wrap;">{{ $rapport->commentaire_encadrant }}</p>
        </div>

        <p>
            Merci de prendre en compte ces remarques et de soumettre une version corrigée dès que possible.
        </p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
