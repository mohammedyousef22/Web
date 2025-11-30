// src/components/common/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant Button réutilisable avec variants et tailles
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon = null,
    iconPosition = 'left',
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    // Variants de couleurs
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
    };

    // Tailles
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
    };

    // Classes de base
    const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={baseClasses}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}

            {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}

            {children}

            {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </button>
    );
};

export default Button;