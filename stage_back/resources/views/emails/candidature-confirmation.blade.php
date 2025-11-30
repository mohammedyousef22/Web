<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; margin: -30px -30px 20px -30px; }
        .success-box { background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Candidature reçue</h1>
        </div>

        <p>Bonjour <strong>{{ $stagiaire->user->name }}</strong>,</p>

        <div class="success-box">
            <p style="margin:0; font-weight: bold;">
                Nous avons bien reçu votre candidature pour l'offre "{{ $offre->titre }}".
            </p>
        </div>

        <p>
            Votre candidature est actuellement <strong>en attente de traitement</strong>. 
            Notre équipe va l'examiner attentivement et vous recevrez une réponse dans les meilleurs délais.
        </p>

        <p>
            Vous pouvez suivre l'état de votre candidature depuis votre tableau de bord sur la plateforme.
        </p>

        <p>Merci pour votre intérêt et à bientôt !</p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
