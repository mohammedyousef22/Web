<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Attestation de Stage</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
            padding: 60px;
            background: linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%);
        }
        .certificate-border {
            border: 8px solid #667eea;
            padding: 40px;
            min-height: 100vh;
            position: relative;
            background-color: white;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .company-name {
            font-size: 18px;
            color: #333;
            margin: 5px 0;
        }
        .title {
            text-align: center;
            margin: 50px 0;
        }
        .title h1 {
            font-size: 36px;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin: 0;
            text-decoration: underline;
            text-decoration-thickness: 3px;
        }
        .subtitle {
            text-align: center;
            font-size: 16px;
            color: #6c757d;
            margin-top: 10px;
            font-style: italic;
        }
        .content {
            margin: 40px 0;
            text-align: justify;
            font-size: 15px;
            line-height: 2;
        }
        .highlight {
            font-weight: bold;
            color: #667eea;
            text-decoration: underline;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 5px solid #667eea;
            padding: 20px;
            margin: 30px 0;
        }
        .info-row {
            display: flex;
            margin: 10px 0;
        }
        .info-label {
            font-weight: bold;
            width: 200px;
            color: #667eea;
        }
        .info-value {
            flex: 1;
        }
        .evaluation {
            background-color: #d4edda;
            border: 2px solid #28a745;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        .evaluation-title {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 15px;
            text-align: center;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
        }
        .signature-box {
            text-align: center;
            width: 40%;
        }
        .signature-line {
            border-top: 2px solid #333;
            margin-top: 60px;
            padding-top: 10px;
        }
        .footer {
            position: absolute;
            bottom: 30px;
            left: 60px;
            right: 60px;
            text-align: center;
            font-size: 11px;
            color: #6c757d;
            border-top: 2px solid #667eea;
            padding-top: 15px;
        }
        .decoration {
            text-align: center;
            font-size: 40px;
            color: #667eea;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="certificate-border">
        <div class="header">
            <div class="logo">🎓 PLATEFORME DE GESTION DES STAGES</div>
            <div class="company-name">{{ config('app.name', 'Entreprise') }}</div>
            <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">
                Département {{ $stage->candidature->offre->departement->nom }}
            </div>
        </div>

        <div class="decoration">❖ ❖ ❖</div>

        <div class="title">
            <h1>Attestation de Stage</h1>
            <div class="subtitle">Certificat d'Accomplissement</div>
        </div>

        <div class="content">
            <p>
                Le soussigné, <span class="highlight">{{ $stage->encadrant->user->name }}</span>, 
                encadrant au sein du département <span class="highlight">{{ $stage->candidature->offre->departement->nom }}</span>,
            </p>

            <p style="text-align: center; font-size: 16px; margin: 30px 0;">
                <strong>ATTESTE QUE</strong>
            </p>

            <p>
                Monsieur/Madame <span class="highlight" style="font-size: 18px;">{{ $stage->candidature->stagiaire->user->name }}</span>,
                de l'établissement <span class="highlight">{{ $stage->candidature->stagiaire->etablissement }}</span>,
                filière <span class="highlight">{{ $stage->candidature->stagiaire->filiere }}</span>,
                a effectué un stage au sein de notre organisation.
            </p>
        </div>

        <div class="info-box">
            <div class="info-row">
                <div class="info-label">📅 Période du stage :</div>
                <div class="info-value">
                    Du {{ \Carbon\Carbon::parse($stage->date_debut_reelle)->format('d/m/Y') }} 
                    au {{ \Carbon\Carbon::parse($stage->date_fin_reelle)->format('d/m/Y') }}
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">⏱️ Durée :</div>
                <div class="info-value">{{ $stage->candidature->offre->duree_jours }} jours</div>
            </div>
            <div class="info-row">
                <div class="info-label">💼 Sujet du stage :</div>
                <div class="info-value">{{ $stage->candidature->offre->titre }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">👨‍💼 Encadrant :</div>
                <div class="info-value">{{ $stage->encadrant->user->name }} - {{ $stage->encadrant->specialite }}</div>
            </div>
        </div>

        @if($stage->evaluation)
        <div class="evaluation">
            <div class="evaluation-title">✨ ÉVALUATION FINALE ✨</div>
            <div class="info-row">
                <div class="info-label">📊 Note obtenue :</div>
                <div class="info-value"><strong style="font-size: 18px; color: #28a745;">{{ number_format($stage->evaluation->note, 2) }}/20</strong></div>
            </div>
            <div class="info-row">
                <div class="info-label">💬 Appréciation :</div>
                <div class="info-value" style="font-style: italic;">
                    "{{ $stage->evaluation->appreciation }}"
                </div>
            </div>
            @if($stage->evaluation->competences_acquises)
            <div style="margin-top: 15px;">
                <div class="info-label">🎯 Compétences acquises :</div>
                <div class="info-value">{{ $stage->evaluation->competences_acquises }}</div>
            </div>
            @endif
        </div>
        @endif

        <div class="content">
            <p>
                Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
            </p>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div>Fait le {{ now()->format('d/m/Y') }}</div>
                <div class="signature-line">
                    <strong>L'Encadrant</strong><br>
                    {{ $stage->encadrant->user->name }}
                </div>
            </div>
            <div class="signature-box">
                <div style="visibility: hidden;">Cachet</div>
                <div class="signature-line">
                    <strong>Cachet de l'Entreprise</strong>
                </div>
            </div>
        </div>

        <div class="footer">
            <strong>Plateforme de Gestion des Stages</strong><br>
            Document généré automatiquement le {{ now()->format('d/m/Y à H:i') }}<br>
            Numéro d'attestation: ATT-{{ str_pad($stage->id, 6, '0', STR_PAD_LEFT) }}-{{ date('Y') }}
        </div>
    </div>
</body>
</html>
