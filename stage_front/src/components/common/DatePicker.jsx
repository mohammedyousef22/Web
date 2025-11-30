// src/components/common/DatePicker.jsx
import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

/**
 * Composant DatePicker simple (HTML5)
 */
const DatePicker = forwardRef(
    (
        {
            label,
            error,
            helperText,
            min,
            max,
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

                {/* DatePicker Container */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                        ref={ref}
                        type="date"
                        min={min}
                        max={max}
                        disabled={disabled}
                        className={`
              block w-full rounded-lg border
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
              pl-10 pr-3 py-2 text-sm
              disabled:bg-gray-100 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-0
              transition-colors duration-200
              ${className}
            `}
                        {...props}
                    />
                </div>

                {/* Error Message */}
                {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

                {/* Helper Text */}
                {!error && helperText && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;