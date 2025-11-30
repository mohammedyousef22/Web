// src/components/common/Skeleton.jsx
import React from 'react';

/**
 * Composant Skeleton pour loading states
 */
const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-6 rounded',
        avatar: 'rounded-full',
        card: 'h-48 rounded-lg',
        button: 'h-10 rounded-lg',
        input: 'h-10 rounded-lg',
    };

    const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
    animate-pulse
    ${variants[variant]}
    ${className}
  `;

    const skeletonStyle = {
        width: width || '100%',
        height: height,
    };

    if (count > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={baseClasses} style={skeletonStyle} />
                ))}
            </div>
        );
    }

    return <div className={baseClasses} style={skeletonStyle} />;
};

/**
 * Composants Skeleton pré-configurés
 */
export const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton variant="title" width="60%" />
        <Skeleton variant="text" count={3} />
        <div className="flex gap-2 pt-2">
            <Skeleton variant="button" width="100px" />
            <Skeleton variant="button" width="100px" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} />
                ))}
            </div>
        ))}
    </div>
);

export const SkeletonList = ({ items = 3 }) => (
    <div className="space-y-4">
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
                <Skeleton variant="avatar" width="48px" height="48px" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="title" width="40%" />
                    <Skeleton variant="text" width="70%" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;