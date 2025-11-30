// src/components/common/Input.jsx
import React, { forwardRef } from 'react';

/**
 * Composant Input réutilisable avec label et gestion d'erreurs
 */
const Input = forwardRef(
    (
        {
            label,
            error,
            helperText,
            type = 'text',
            placeholder,
            icon: Icon = null,
            iconPosition = 'left',
            required = false,
            disabled = false,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Icon Left */}
                    {Icon && iconPosition === 'left' && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`
              block w-full rounded-lg border
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
              ${Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
              ${Icon && iconPosition === 'right' ? 'pr-10' : 'pr-3'}
              py-2 text-sm
              placeholder:text-gray-400
              disabled:bg-gray-100 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-0
              transition-colors duration-200
              ${className}
            `}
                        {...props}
                    />

                    {/* Icon Right */}
                    {Icon && iconPosition === 'right' && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}

                {/* Helper Text */}
                {!error && helperText && (
                    <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;