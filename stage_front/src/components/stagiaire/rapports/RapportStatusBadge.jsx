// src/components/stagiaire/rapports/RapportStatusBadge.jsx
export const RapportStatusBadge = ({ statut }) => {
    const config = {
        en_attente: { label: 'En attente', variant: 'warning' },
        valide: { label: 'Validé', variant: 'success' },
        a_corriger: { label: 'À corriger', variant: 'danger' },
    };
    const { label, variant } = config[statut] || config.en_attente;
    return <Badge variant={variant}>{label}</Badge>;
};