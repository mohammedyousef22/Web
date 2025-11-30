// src/components/common/Toast.jsx
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Utilitaire pour afficher des notifications toast
 * Utilise react-toastify sous le capot
 */

const toastConfig = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const Toast = {
    /**
     * Toast de succès
     */
    success: (message, options = {}) => {
        toast.success(
            <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>{message}</span>
            </div>,
            { ...toastConfig, ...options }
        );
    },

    /**
     * Toast d'erreur
     */
    error: (message, options = {}) => {
        toast.error(
            <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>{message}</span>
            </div>,
            { ...toastConfig, ...options }
        );
    },

    /**
     * Toast d'avertissement
     */
    warning: (message, options = {}) => {
        toast.warning(
            <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span>{message}</span>
            </div>,
            { ...toastConfig, ...options }
        );
    },

    /**
     * Toast d'information
     */
    info: (message, options = {}) => {
        toast.info(
            <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>{message}</span>
            </div>,
            { ...toastConfig, ...options }
        );
    },

    /**
     * Toast de promesse (loading, success, error)
     */
    promise: (promise, messages = {}) => {
        return toast.promise(
            promise,
            {
                pending: messages.pending || 'Chargement...',
                success: messages.success || 'Opération réussie !',
                error: messages.error || 'Une erreur est survenue',
            },
            toastConfig
        );
    },
};

export default Toast;