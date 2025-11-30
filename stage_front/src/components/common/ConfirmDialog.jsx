// src/components/common/ConfirmDialog.jsx
import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * Dialog de confirmation avec différents types
 */
const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    loading = false,
}) => {
    const types = {
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
            iconBg: 'bg-yellow-100',
            confirmVariant: 'warning',
        },
        danger: {
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            confirmVariant: 'danger',
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            confirmVariant: 'primary',
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            confirmVariant: 'success',
        },
    };

    const config = types[type];
    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm();
        if (!loading) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={config.confirmVariant} onClick={handleConfirm} loading={loading}>
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;