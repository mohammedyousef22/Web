// src/components/stagiaire/candidatures/CandidatureStatusBadge.jsx
import React from 'react';
import { Badge } from '@/components/common';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const CandidatureStatusBadge = ({ statut }) => {
    const config = {
        en_attente: { label: 'En attente', variant: 'warning', icon: Clock },
        accepte: { label: 'Acceptée', variant: 'success', icon: CheckCircle },
        refuse: { label: 'Refusée', variant: 'danger', icon: XCircle },
    };

    const { label, variant, icon: Icon } = config[statut] || config.en_attente;

    return <Badge variant={variant} icon={Icon}>{label}</Badge>;
};