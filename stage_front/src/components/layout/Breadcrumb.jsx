// src/components/layout/Breadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb (Fil d'Ariane)
 */
const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            {/* Home */}
            <Link
                to="/"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
            </Link>

            {/* Items */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />

                        {isLast ? (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                        ) : (
                            <Link
                                to={item.path}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;