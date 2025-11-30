<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Stages</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #17a2b8; padding-bottom: 15px; }
        .header h1 { color: #17a2b8; margin: 0; font-size: 24px; }
        .metadata { text-align: right; color: #6c757d; font-size: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #17a2b8; color: white; padding: 10px; text-align: left; font-size: 10px; }
        td { padding: 8px; border-bottom: 1px solid #dee2e6; font-size: 9px; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .footer { margin-top: 30px; text-align: center; color: #6c757d; font-size: 10px; border-top: 2px solid #dee2e6; padding-top: 10px; }
        .badge { padding: 3px 8px; border-radius: 3px; font-size: 8px; font-weight: bold; }
        .badge-success { background-color: #d4edda; color: #155724; }
        .badge-warning { background-color: #fff3cd; color: #856404; }
        .badge-danger { background-color: #f8d7da; color: #721c24; }
        .stats { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .stats-row { display: flex; justify-content: space-around; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 20px; font-weight: bold; color: #17a2b8; }
        .stat-label { font-size: 10px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Liste des Stages</h1>
        <p style="margin: 5px 0; color: #6c757d;">Plateforme de Gestion des Stages</p>
    </div>

    <div class="metadata">
        <strong>Date de génération :</strong> {{ now()->format('d/m/Y à H:i') }}<br>
        <strong>Total stages :</strong> {{ $stages->count() }}
    </div>

    <div class="stats">
        <div class="stats-row">
            <div class="stat-item">
                <div class="stat-value">{{ $stages->where('statut', 'en_cours')->count() }}</div>
                <div class="stat-label">EN COURS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $stages->where('statut', 'termine')->count() }}</div>
                <div class="stat-label">TERMINÉS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $stages->where('statut', 'interrompu')->count() }}</div>
                <div class="stat-label">INTERROMPUS</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ $stages->whereNotNull('note_finale')->avg('note_finale') ? number_format($stages->whereNotNull('note_finale')->avg('note_finale'), 2) : '-' }}</div>
                <div class="stat-label">NOTE MOYENNE</div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Stagiaire</th>
                <th>Encadrant</th>
                <th>Département</th>
                <th>Offre</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Note</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stages as $index => $stage)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $stage->candidature->stagiaire->user->name }}</strong></td>
                <td>{{ $stage->encadrant->user->name }}</td>
                <td>{{ $stage->candidature->offre->departement->nom }}</td>
                <td>{{ Str::limit($stage->candidature->offre->titre, 25) }}</td>
                <td>{{ \Carbon\Carbon::parse($stage->date_debut_reelle)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($stage->date_fin_reelle)->format('d/m/Y') }}</td>
                <td>
                    @if($stage->statut === 'en_cours')
                        <span class="badge badge-success">En cours</span>
                    @elseif($stage->statut === 'termine')
                        <span class="badge badge-warning">Terminé</span>
                    @else
                        <span class="badge badge-danger">Interrompu</span>
                    @endif
                </td>
                <td style="text-align: center; font-weight: bold;">
                    {{ $stage->note_finale ? number_format($stage->note_finale, 2) . '/20' : '-' }}
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
