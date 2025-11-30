// src/components/common/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Composant Pagination
 */
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, className = '' }) => {
    const maxPagesToShow = 5;

    // Calculer la plage de pages à afficher
    const getPageRange = () => {
        const half = Math.floor(maxPagesToShow / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxPagesToShow - 1, totalPages);

        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(end - maxPagesToShow + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageRange = getPageRange();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {/* Info */}
            <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur{' '}
                <span className="font-medium">{totalItems}</span> résultats
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Première page"
                >
                    <ChevronsLeft className="w-5 h-5" />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Page précédente"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                {pageRange.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
            `}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Page */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Page suivante"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Dernière page"
                >
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;