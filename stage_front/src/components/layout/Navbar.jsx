// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { authService } from '@/api/services';
import { useAuth } from '@/context/AuthContext';

/**
 * Navbar principale avec notifications et menu utilisateur
 */
const Navbar = ({ onMenuToggle, showMenuButton = true }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-blue-100 text-blue-800',
            stagiaire: 'bg-green-100 text-green-800',
            encadrant: 'bg-orange-100 text-orange-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role) => {
        const labels = {
            admin: 'Administrateur',
            stagiaire: 'Stagiaire',
            encadrant: 'Encadrant',
        };
        return labels[role] || role;
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                    {/* Menu Toggle (Mobile) */}
                    {showMenuButton && (
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                    )}

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900 hidden sm:block">
                            Gestion Stages
                        </span>
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            {/* Badge */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Dropdown Notifications (À développer) */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                    Aucune nouvelle notification
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role)}`}>
                                    {getRoleLabel(user?.role)}
                                </p>
                            </div>
                        </button>

                        {/* Dropdown User Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>

                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User className="w-4 h-4" />
                                    Mon Profil
                                </Link>

                                <Link
                                    to="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Paramètres
                                </Link>

                                <hr className="my-2" />

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;