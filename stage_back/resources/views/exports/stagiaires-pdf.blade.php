<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Stagiaires</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #667eea;
            margin: 0;
            font-size: 24px;
        }
        .metadata {
            text-align: right;
            color: #6c757d;
            font-size: 10px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #dee2e6;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6c757d;
            font-size: 10px;
            border-top: 2px solid #dee2e6;
            padding-top: 10px;
        }
        .badge {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-success { background-color: #d4edda; color: #155724; }
        .badge-warning { background-color: #fff3cd; color: #856404; }
        .badge-danger { background-color: #f8d7da; color: #721c24; }
        .stats {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .stats-row {
            display: flex;
            justify-content: space-around;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 10px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Liste des Stagiaires</h1>
        <p style="margin: 5px 0; color: #6c757d;">Plateforme de Gestion des Stages</p>
    </div>

    <div class="metadata">
        <strong>Date de génération :</strong> {{ now()->format('d/m/Y à H:i') }}<br>
        <strong>Total stagiaires :</strong> {{ $stagiaires->count() }}
    </div>

    <div class="stats">
        <div class="stats-row">
            <div class="stat-item">
                <div class="stat-value">{{ $stagiaires->count() }}</div>
                <div class="stat-label">TOTAL STAGIAIRES</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $stagiaires->filter(fn($s) => $s->stage && $s->stage->statut === 'en_cours')->count() }}</div>
                <div class="stat-label">STAGES EN COURS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $stagiaires->filter(fn($s) => $s->stage && $s->stage->statut === 'termine')->count() }}</div>
                <div class="stat-label">STAGES TERMINÉS</div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Établissement</th>
                <th>Filière</th>
                <th>Téléphone</th>
                <th>Encadrant</th>
                <th>Statut Stage</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stagiaires as $index => $stagiaire)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $stagiaire->user->name }}</strong></td>
                <td>{{ $stagiaire->user->email }}</td>
                <td>{{ Str::limit($stagiaire->etablissement, 30) }}</td>
                <td>{{ $stagiaire->filiere }}</td>
                <td>{{ $stagiaire->telephone }}</td>
                <td>
                    @if($stagiaire->stage && $stagiaire->stage->statut === 'en_cours')
                        {{ $stagiaire->stage->encadrant->user->name }}
                    @else
                        -
                    @endif
                </td>
                <td>
                    @if($stagiaire->stage && $stagiaire->stage->statut === 'en_cours')
                        <span class="badge badge-success">En cours</span>
                    @elseif($stagiaire->stage && $stagiaire->stage->statut === 'termine')
                        <span class="badge badge-warning">Terminé</span>
                    @else
                        <span class="badge badge-danger">Aucun stage</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p><strong>Plateforme de Gestion des Stages</strong> - Document généré automatiquement</p>
        <p>Page 1/1</p>
    </div>
</body>
</html>
