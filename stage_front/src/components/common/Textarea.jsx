// src/components/common/Textarea.jsx
import React, { forwardRef } from 'react';

/**
 * Composant Textarea réutilisable
 */
const Textarea = forwardRef(
    (
        {
            label,
            error,
            helperText,
            placeholder,
            rows = 4,
            maxLength,
            showCharCount = false,
            required = false,
            disabled = false,
            className = '',
            value,
            ...props
        },
        ref
    ) => {
        const currentLength = value?.length || 0;

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Textarea */}
                <textarea
                    ref={ref}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                    disabled={disabled}
                    value={value}
                    className={`
            block w-full rounded-lg border
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            px-3 py-2 text-sm
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-200
            resize-vertical
            ${className}
          `}
                    {...props}
                />

                {/* Character Count / Helper Text / Error */}
                <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex-1">
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {!error && helperText && <p className="text-sm text-gray-500">{helperText}</p>}
                    </div>

                    {showCharCount && maxLength && (
                        <p className={`text-sm ml-2 ${currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                            {currentLength} / {maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;