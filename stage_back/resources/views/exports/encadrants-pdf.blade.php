<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Encadrants</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #28a745; padding-bottom: 15px; }
        .header h1 { color: #28a745; margin: 0; font-size: 24px; }
        .metadata { text-align: right; color: #6c757d; font-size: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #28a745; color: white; padding: 10px; text-align: left; font-size: 11px; }
        td { padding: 8px; border-bottom: 1px solid #dee2e6; font-size: 10px; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .footer { margin-top: 30px; text-align: center; color: #6c757d; font-size: 10px; border-top: 2px solid #dee2e6; padding-top: 10px; }
        .stats { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .stats-row { display: flex; justify-content: space-around; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 20px; font-weight: bold; color: #28a745; }
        .stat-label { font-size: 10px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>👨‍💼 Liste des Encadrants</h1>
        <p style="margin: 5px 0; color: #6c757d;">Plateforme de Gestion des Stages</p>
    </div>

    <div class="metadata">
        <strong>Date de génération :</strong> {{ now()->format('d/m/Y à H:i') }}<br>
        <strong>Total encadrants :</strong> {{ $encadrants->count() }}
    </div>

    <div class="stats">
        <div class="stats-row">
            <div class="stat-item">
                <div class="stat-value">{{ $encadrants->count() }}</div>
                <div class="stat-label">TOTAL ENCADRANTS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $encadrants->filter(fn($e) => $e->user->is_active)->count() }}</div>
                <div class="stat-label">ACTIFS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $encadrants->sum(fn($e) => $e->stages->where('statut', 'en_cours')->count()) }}</div>
                <div class="stat-label">STAGIAIRES ENCADRÉS</div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Département</th>
                <th>Spécialité</th>
                <th>Nb Stagiaires</th>
                <th>Date Création</th>
            </tr>
        </thead>
        <tbody>
            @foreach($encadrants as $index => $encadrant)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $encadrant->user->name }}</strong></td>
                <td>{{ $encadrant->user->email }}</td>
                <td>{{ $encadrant->telephone }}</td>
                <td>{{ $encadrant->departement->nom }}</td>
                <td>{{ $encadrant->specialite }}</td>
                <td style="text-align: center; font-weight: bold;">
                    {{ $encadrant->stages->count() }}
                </td>
                <td>{{ $encadrant->created_at->format('d/m/Y') }}</td>
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
