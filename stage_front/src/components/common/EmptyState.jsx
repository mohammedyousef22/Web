// src/components/common/EmptyState.jsx
import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * Composant EmptyState pour afficher un état vide
 */
const EmptyState = ({
    icon: Icon = Inbox,
    title = 'Aucune donnée',
    description,
    action,
    actionLabel,
    onAction,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

            {description && <p className="text-sm text-gray-500 text-center max-w-md mb-6">{description}</p>}

            {action && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel || 'Ajouter'}
                </Button>
            )}

            {action && !onAction && action}
        </div>
    );
};

export default EmptyState;