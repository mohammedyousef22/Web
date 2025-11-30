<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: -30px -30px 20px -30px; }
        .credentials-box { background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .code { background-color: #f8f9fa; padding: 5px 10px; border-radius: 3px; font-family: monospace; color: #e83e8c; }
        .warning { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Bienvenue sur la Plateforme</h1>
        </div>

        <p>Bonjour <strong>{{ $encadrant->user->name }}</strong>,</p>

        <p>
            Votre compte encadrant a été créé avec succès. 
            Vous pouvez maintenant accéder à la plateforme de gestion des stages.
        </p>

        <h3>🔑 Vos identifiants de connexion :</h3>
        <div class="credentials-box">
            <p><strong>Email :</strong> <span class="code">{{ $encadrant->user->email }}</span></p>
            <p><strong>Mot de passe temporaire :</strong> <span class="code">{{ $temporaryPassword }}</span></p>
        </div>

        <div class="warning">
            <p style="margin:0; font-weight: bold;">
                ⚠️ Important : Vous devez changer ce mot de passe lors de votre première connexion pour des raisons de sécurité.
            </p>
        </div>

        <p>
            <strong>Département assigné :</strong> {{ $encadrant->departement->nom }}<br>
            <strong>Spécialité :</strong> {{ $encadrant->specialite }}
        </p>

        <p>
            En tant qu'encadrant, vous pourrez :<br>
            ✅ Consulter vos stagiaires assignés<br>
            ✅ Valider leurs rapports<br>
            ✅ Évaluer leurs performances<br>
            ✅ Générer des attestations de stage
        </p>

        <p>
            Nous vous souhaitons la bienvenue et espérons une collaboration fructueuse !
        </p>

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
