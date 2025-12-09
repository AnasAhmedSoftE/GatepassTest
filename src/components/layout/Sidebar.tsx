'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui';
import { NavItem } from './Navigation';

interface SidebarProps {
    items: NavItem[];
    locale: 'en' | 'ar';
    isRTL: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, locale, isRTL }) => {
    return (
        <aside className="w-64 bg-white border-r border-purple-200 h-full overflow-y-auto lg:fixed lg:left-0 lg:top-0 lg:bottom-0" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin/dashboard" className="flex flex-col items-center">
                    <Logo size="lg" showText={false} />
                    <div className="mt-3 text-center">
                        <h1 className="text-xl font-bold text-gray-900">MAJIS</h1>
                        <p className="text-xs text-gray-600 mt-1">مَجِيس</p>
                    </div>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1" role="navigation" aria-label="Main navigation">
                {items.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}
            </nav>
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

