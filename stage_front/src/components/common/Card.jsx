// src/components/common/Card.jsx
import React from 'react';

/**
 * Composant Card réutilisable
 */
const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    footer,
    padding = 'normal',
    shadow = 'md',
    hover = false,
    className = '',
}) => {
    const paddings = {
        none: '',
        sm: 'p-3',
        normal: 'p-6',
        lg: 'p-8',
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
    };

    return (
        <div
            className={`
        bg-white rounded-lg border border-gray-200
        ${shadows[shadow]}
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
        >
            {/* Header */}
            {(title || subtitle || headerAction) && (
                <div className={`border-b border-gray-200 ${paddings[padding]}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            )}
                            {subtitle && (
                                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        {headerAction && <div className="ml-4">{headerAction}</div>}
                    </div>
                </div>
            )}

            {/* Body */}
            <div className={paddings[padding]}>{children}</div>

            {/* Footer */}
            {footer && (
                <div className={`border-t border-gray-200 ${paddings[padding]} bg-gray-50`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;