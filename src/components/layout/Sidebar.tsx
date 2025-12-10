'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui';
import { NavItem } from './Navigation';
import { User } from '@/hooks/useAuth';

interface SidebarProps {
    items: NavItem[];
    locale: 'en' | 'ar';
    isRTL: boolean;
    user: User | null;
    onLogout: () => void;
    onToggleLocale: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, locale, isRTL, user, onLogout, onToggleLocale }) => {
    return (
        <aside className="w-64 bg-white border-r border-purple-200 h-full flex flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <Link href="/admin/dashboard" className="flex flex-col items-center">
                    <Logo size="lg" showText={false} />
                    <div className="mt-3 text-center">
                        <h1 className="text-xl font-bold text-gray-900">MAJIS</h1>
                        <p className="text-xs text-gray-600 mt-1">مَجِيس</p>
                    </div>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
                {items.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}
            </nav>

            {/* Footer Section - User Info, Language Toggle, and Logout */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
                {/* User Info */}
                {user && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize truncate">
                                    {user.role.replace('_', ' ').toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Language Toggle Button */}
                <button
                    onClick={onToggleLocale}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-all duration-200 font-medium text-sm"
                    aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                </button>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-danger-500 text-white hover:bg-danger-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                    aria-label={locale === 'en' ? 'Logout' : 'تسجيل الخروج'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{locale === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
                </button>
            </div>
        </aside>
    );
};

interface NavLinkProps {
    item: NavItem;
}

const NavLink: React.FC<NavLinkProps> = ({ item }) => {
    const isActive = item.active;

    // Icon components matching the design
    const getIcon = () => {
        const iconClass = `w-5 h-5 ${isActive ? 'text-white' : 'text-secondary-500'}`;
        
        if (item.href.includes('dashboard')) {
            // Dashboard - 2x2 grid icon
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            );
        } else if (item.href.includes('requests')) {
            // Requests - People icon
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        } else if (item.href.includes('users')) {
            // Users - Person in document icon
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        } else if (item.href.includes('activity') || item.href.includes('logs')) {
            // Activity Logs - Star/Cross icon
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        }
        // Default icon
        return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        );
    };

    return (
        <Link
            href={item.href}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                    ? 'bg-secondary-600 text-white font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }
            `}
            aria-current={isActive ? 'page' : undefined}
        >
            {getIcon()}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
                <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-danger-500 text-white'
                }`}>
                    {item.badge}
                </span>
            )}
        </Link>
    );
};

