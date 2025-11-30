// src/components/common/Select.jsx
import React, { forwardRef } from 'react';

/**
 * Composant Select réutilisable
 */
const Select = forwardRef(
    (
        {
            label,
            error,
            helperText,
            options = [],
            placeholder = 'Sélectionner...',
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

                {/* Select */}
                <select
                    ref={ref}
                    disabled={disabled}
                    className={`
            block w-full rounded-lg border
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            px-3 py-2 text-sm
            disabled:bg-gray-100 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-200
            ${className}
          `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Error Message */}
                {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

                {/* Helper Text */}
                {!error && helperText && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;