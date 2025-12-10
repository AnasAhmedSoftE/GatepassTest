'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Container } from './Container';
import { Sidebar } from './Sidebar';
import { Button } from '../ui';
import { useAuth, useLocale, usePermissions } from '@/hooks';
import { getNavItems } from '@/config/navigation';
import { PageLoader } from '../ui/LoadingSpinner';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, isAuthenticated, logout } = useAuth();
    const { locale, toggleLocale, isRTL } = useLocale();
    const { hasPermission } = usePermissions(user);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated || !user) {
        return <PageLoader message="Loading..." />;
    }

    const navItems = getNavItems(locale, user.permissions, user.role, pathname);

    return (
        <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <Sidebar 
                items={navItems} 
                locale={locale} 
                isRTL={isRTL}
                user={user}
                onLogout={logout}
                onToggleLocale={toggleLocale}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Mobile Sidebar */}
            <div className={`
                lg:hidden fixed left-0 top-0 bottom-0 z-50 transform transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar 
                    items={navItems} 
                    locale={locale} 
                    isRTL={isRTL}
                    user={user}
                    onLogout={logout}
                    onToggleLocale={toggleLocale}
                />
            </div>
        </div>
    );
};
