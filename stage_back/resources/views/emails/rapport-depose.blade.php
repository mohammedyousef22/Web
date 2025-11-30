<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #17a2b8; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: -30px -30px 20px -30px; }
        .alert-box { background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; }
        .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 Nouveau Rapport Déposé</h1>
        </div>

        <p>Bonjour <strong>{{ $encadrant->user->name }}</strong>,</p>

        <div class="alert-box">
            <p style="margin:0; font-weight: bold;">
                {{ $stagiaire->user->name }} a déposé un nouveau rapport pour validation.
            </p>
        </div>

        <h3>Informations du rapport :</h3>
        <div class="info-box">
            <p><strong>Stagiaire :</strong> {{ $stagiaire->user->name }}</p>
            <p><strong>Type de rapport :</strong> {{ ucfirst($rapport->type) }}</p>
            <p><strong>Titre :</strong> {{ $rapport->titre }}</p>
            <p><strong>Date de dépôt :</strong> {{ \Carbon\Carbon::parse($rapport->date_depot)->format('d/m/Y à H:i') }}</p>
        </div>

        <p>
            Merci de vous connecter à la plateforme pour consulter et valider ce rapport.
        </p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
