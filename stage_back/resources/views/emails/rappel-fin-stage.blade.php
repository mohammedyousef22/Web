<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #ff6b6b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: -30px -30px 20px -30px; }
        .reminder-box { background-color: #ffe3e3; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; }
        .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Rappel : Fin de Stage Proche</h1>
        </div>

        <p>Bonjour <strong>{{ $destinataire->name }}</strong>,</p>

        <div class="reminder-box">
            <p style="margin:0; font-weight: bold;">
                Le stage de {{ $stagiaire->user->name }} se termine dans 7 jours.
            </p>
        </div>

        <h3>📋 Informations du stage :</h3>
        <div class="info-box">
            <p><strong>Stagiaire :</strong> {{ $stagiaire->user->name }}</p>
            <p><strong>Encadrant :</strong> {{ $encadrant->user->name }}</p>
            <p><strong>Département :</strong> {{ $stage->candidature->offre->departement->nom }}</p>
            <p><strong>Date de fin :</strong> {{ \Carbon\Carbon::parse($stage->date_fin_reelle)->format('d/m/Y') }}</p>
            <p><strong>Jours restants :</strong> {{ \Carbon\Carbon::parse($stage->date_fin_reelle)->diffInDays(now()) }} jours</p>
        </div>

        @if($destinataire->role === 'stagiaire')
        <p>
            <strong>N'oubliez pas de :</strong><br>
            ✅ Déposer votre rapport final si ce n'est pas encore fait<br>
            ✅ Finaliser vos tâches en cours<br>
            ✅ Préparer votre bilan de stage
        </p>
        @else
        <p>
            <strong>N'oubliez pas de :</strong><br>
            ✅ Valider le rapport final du stagiaire<br>
            ✅ Préparer l'évaluation finale<br>
            ✅ Compléter les documents administratifs
        </p>
        @endif

        <div class="footer">
            <p><strong>Plateforme de Gestion des Stages</strong></p>
        </div>
    </div>
</body>
</html>
