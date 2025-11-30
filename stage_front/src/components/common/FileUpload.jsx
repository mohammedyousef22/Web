// src/components/common/FileUpload.jsx
import React, { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import Button from './Button';

/**
 * Composant FileUpload avec drag & drop
 */
const FileUpload = ({
    label,
    accept = '*',
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    showPreview = true,
    className = '',
}) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        // Validation taille
        if (selectedFile.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
            alert(`Le fichier est trop volumineux. Taille maximum : ${maxSizeMB}MB`);
            return;
        }

        setFile(selectedFile);
        onChange?.(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        setFile(null);
        onChange?.(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative border-2 border-dashed rounded-lg p-6
          transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          ${error ? 'border-red-300' : ''}
        `}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    disabled={disabled}
                    className="hidden"
                />

                {!file ? (
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                            Cliquez pour sélectionner ou glissez un fichier
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Taille max: {formatFileSize(maxSize)}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <File className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="ml-4 p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

            {/* Helper Text */}
            {!error && helperText && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
};

export default FileUpload;