<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Évaluation Disponible</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Évaluation de Stage</h1>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        
        <p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{ $stagiaire->user->name }}</strong>,</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #28a745;">
            <h2 style="color: #28a745; margin-top: 0; font-size: 20px;">✅ Votre stage a été évalué</h2>
            <p style="margin-bottom: 10px;">Nous avons le plaisir de vous informer que votre évaluation de stage est maintenant disponible.</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📊 Résultats de l'évaluation</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                    <td style="padding: 10px; background-color: #f8f9fa; font-weight: bold; width: 40%;">Note finale :</td>
                    <td style="padding: 10px; background-color: #f8f9fa;">
                        <span style="font-size: 24px; font-weight: bold; color: #28a745;">{{ $evaluation->note }}/20</span>
                        <span style="background-color: #28a745; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px; margin-left: 10px;">
                            {{ $evaluation->getMention() }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Encadrant :</td>
                    <td style="padding: 10px;">{{ $encadrant->user->name }}</td>
                </tr>
                @if($encadrant->specialite)
                <tr>
                    <td style="padding: 10px; background-color: #f8f9fa; font-weight: bold;">Spécialité :</td>
                    <td style="padding: 10px; background-color: #f8f9fa;">{{ $encadrant->specialite }}</td>
                </tr>
                @endif
            </table>
        </div>

        @if($evaluation->competences_acquises)
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">💼 Compétences acquises</h3>
            <p style="margin: 0; line-height: 1.8;">{{ $evaluation->competences_acquises }}</p>
        </div>
        @endif

        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">💬 Appréciation de l'encadrant</h3>
            <p style="margin: 0; font-style: italic; line-height: 1.8; color: #555;">{{ $evaluation->appreciation }}</p>
        </div>

        <div style="background-color: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0; font-size: 18px;">📄 Attestation de stage</h3>
            <p style="margin: 10px 0; color: #155724;">Votre attestation de stage officielle est jointe à cet email.</p>
            <p style="margin: 0; font-size: 14px; color: #155724;">Vous pouvez également la télécharger depuis votre espace personnel.</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px;">🎉 Félicitations pour votre réussite !</p>
            <p style="color: #6c757d; margin: 0;">Nous vous souhaitons beaucoup de succès pour la suite de votre parcours professionnel.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

        <p style="font-size: 14px; color: #6c757d; text-align: center; margin: 0;">
            Cet email a été envoyé automatiquement par la plateforme de gestion des stages.<br>
            Pour toute question, veuillez contacter votre encadrant.
        </p>
    </div>
    
</body>
</html>
