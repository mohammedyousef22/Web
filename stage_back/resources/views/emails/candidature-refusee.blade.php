<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
        }
        .message-box {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réponse à votre candidature</h1>
        </div>

        <p>Bonjour <strong>{{$stagiaire->user->name }}</strong>,</p>

        <div class="message-box">
            <p style="margin:0;">
                Nous avons le regret de vous informer que votre candidature pour l'offre 
                <strong>"{{ $offre->titre }}"</strong> n'a pas été retenue.
            </p>
        </div>

        <p>
            Nous vous remercions pour l'intérêt que vous portez à notre entreprise 
            et vous encourageons à postuler à d'autres offres correspondant à votre profil.
        </p>

        <p>
            Nous vous souhaitons beaucoup de succès dans vos recherches.
        </p>

        <p>Cordialement,</p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
