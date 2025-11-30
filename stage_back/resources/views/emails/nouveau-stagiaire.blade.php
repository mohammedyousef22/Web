<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px;text-align: center; margin: -30px -30px 20px -30px; }
        .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dee2e6; }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #28a745; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👨‍🎓 Nouveau Stagiaire Assigné</h1>
        </div>

        <p>Bonjour <strong>{{ $encadrant->user->name }}</strong>,</p>

        <p>
            Un nouveau stagiaire vous a été assigné. 
            Vous serez l'encadrant pour <strong>{{ $stagiaire->user->name }}</strong>.
        </p>

        <h3>📋 Informations du stagiaire :</h3>
        <div class="info-box">
            <div class="info-row">
                <span class="label">Nom complet :</span>
                <span>{{ $stagiaire->user->name }}</span>
            </div>
            <div class="info-row">
                <span class="label">Email :</span>
                <span>{{ $stagiaire->user->email }}</span>
            </div>
            <div class="info-row">
                <span class="label">Téléphone :</span>
                <span>{{ $stagiaire->telephone }}</span>
            </div>
            <div class="info-row">
                <span class="label">Établissement :</span>
                <span>{{ $stagiaire->etablissement }}</span>
            </div>
            <div class="info-row">
                <span class="label">Filière :</span>
                <span>{{ $stagiaire->filiere }}</span>
            </div>
        </div>

        <h3>📅 Détails du stage :</h3>
        <div class="info-box">
            <div class="info-row">
                <span class="label">Offre :</span>
                <span>{{ $offre->titre }}</span>
            </div>
            <div class="info-row">
                <span class="label">Date de début :</span>
                <span>{{ \Carbon\Carbon::parse($stage->date_debut_reelle)->format('d/m/Y') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Date de fin :</span>
                <span>{{ \Carbon\Carbon::parse($stage->date_fin_reelle)->format('d/m/Y') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Durée :</span>
                <span>{{ $offre->duree_jours }} jours</span>
            </div>
        </div>

        <p>
            <strong>Prochaines étapes :</strong><br>
            Merci de contacter le stagiaire pour organiser son intégration et discuter 
            des objectifs du stage.
        </p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
