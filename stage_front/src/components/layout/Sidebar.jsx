// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    UserCheck,
    Building2,
    Settings,
    X,
    GraduationCap,
    ClipboardList,
    Upload,
    Star,
    UserCog,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Sidebar avec navigation dynamique selon le rôle
 */
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    // Menus selon le rôle
    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: Briefcase, label: 'Offres', path: '/admin/offres' },
            { icon: FileText, label: 'Candidatures', path: '/admin/candidatures' },
            { icon: UserCheck, label: 'Encadrants', path: '/admin/encadrants' },
            { icon: GraduationCap, label: 'Stagiaires', path: '/admin/stagiaires' },
            { icon: Building2, label: 'Départements', path: '/admin/departements' },
            { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
        ],
        stagiaire: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/stagiaire/dashboard' },
            { icon: Briefcase, label: 'Offres Disponibles', path: '/stagiaire/offres' },
            { icon: FileText, label: 'Mes Candidatures', path: '/stagiaire/candidatures' },
            { icon: ClipboardList, label: 'Mon Stage', path: '/stagiaire/stage' },
            { icon: Upload, label: 'Mes Rapports', path: '/stagiaire/rapports' },
            
            { icon: UserCog, label: 'Mon Profil', path: '/stagiaire/profil' },
        ],
        encadrant: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/encadrant/dashboard' },
            { icon: Users, label: 'Mes Stagiaires', path: '/encadrant/stagiaires' },
            { icon: Upload, label: 'Rapports à Valider', path: '/encadrant/rapports' },
            { icon: Star, label: 'Évaluations', path: '/encadrant/evaluations' },
            { icon: UserCog, label: 'Mon Profil', path: '/encadrant/profil' },
        ],
    };

    const currentMenu = menuItems[user?.role] || [];

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Backdrop Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-64
        `}
            >
                {/* Header Mobile */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                    <span className="font-bold text-xl text-gray-900">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                    {currentMenu.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${active
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                `}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500 text-center">
                        <p>Version 1.0.0</p>
                        <p className="mt-1">© 2025 Gestion Stages</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;