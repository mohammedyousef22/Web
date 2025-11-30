<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidature Acceptée</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .congratulations {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #667eea;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Félicitations !</h1>
        </div>

        <div class="congratulations">
            <p style="margin:0; font-weight: bold; font-size: 16px;">
                Votre candidature a été acceptée !
            </p>
        </div>

        <p>Bonjour <strong>{{ $stagiaire->user->name }}</strong>,</p>

        <p>
            Nous avons le plaisir de vous informer que votre candidature pour l'offre 
            <strong>"{{ $offre->titre }}"</strong> a été acceptée.
        </p>

        <h3>📋 Informations sur votre stage :</h3>
        <div class="info-box">
            <div class="info-row">
                <span class="label">Département :</span>
                <span>{{ $offre->departement->nom }}</span>
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

        <h3>👨‍💼 Votre encadrant :</h3>
        <div class="info-box">
            <div class="info-row">
                <span class="label">Nom :</span>
                <span>{{ $encadrant->user->name }}</span>
            </div>
            <div class="info-row">
                <span class="label">Email :</span>
                <span>{{ $encadrant->user->email }}</span>
            </div>
            <div class="info-row">
                <span class="label">Téléphone :</span>
                <span>{{ $encadrant->telephone }}</span>
            </div>
            <div class="info-row">
                <span class="label">Spécialité :</span>
                <span>{{ $encadrant->specialite }}</span>
            </div>
        </div>

        <p>
            <strong>Prochaines étapes :</strong><br>
            Votre encadrant vous contactera prochainement pour discuter des détails du stage 
            et organiser votre premier jour.
        </p>

        <p>
            Nous vous souhaitons beaucoup de succès dans cette nouvelle aventure !
        </p>

        <div class="footer">
            <p>
                <strong>Plateforme de Gestion des Stages</strong><br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>
