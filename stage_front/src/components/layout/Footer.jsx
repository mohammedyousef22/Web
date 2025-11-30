// src/components/layout/Footer.jsx
import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Footer de l'application
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <div className="text-sm text-gray-600">
                        © {currentYear} Plateforme Gestion des Stages. Tous droits réservés.
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            À propos
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Aide
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Contact
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Confidentialité
                        </a>
                    </div>

                    {/* Made with */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>Fait avec</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>par votre équipe</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;