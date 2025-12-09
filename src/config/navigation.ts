import { NavItem } from '@/components/layout/Navigation';

export const PERMISSIONS = {
    MANAGE_REQUESTS: 'MANAGE_REQUESTS',
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_LOGS: 'VIEW_LOGS',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS = {
    en: {
        [PERMISSIONS.MANAGE_REQUESTS]: 'Manage Requests',
        [PERMISSIONS.MANAGE_USERS]: 'Manage Users',
        [PERMISSIONS.VIEW_LOGS]: 'View Activity Logs',
    },
    ar: {
        [PERMISSIONS.MANAGE_REQUESTS]: 'إدارة الطلبات',
        [PERMISSIONS.MANAGE_USERS]: 'إدارة المستخدمين',
        [PERMISSIONS.VIEW_LOGS]: 'عرض سجل النشاط',
    },
};

export const getNavItems = (
    locale: 'en' | 'ar',
    userPermissions: string[] = [],
    userRole?: string,
    currentPath?: string
): NavItem[] => {
    const isSuperAdmin = userRole === 'SUPER_ADMIN';

    const hasPermission = (permission: string) => {
        return isSuperAdmin || userPermissions.includes(permission);
    };

    const items: NavItem[] = [
        {
            label: locale === 'en' ? 'Dashboard' : 'لوحة التحكم',
            href: '/admin/dashboard',
            active: currentPath === '/admin/dashboard',
        },
    ];

    if (hasPermission(PERMISSIONS.MANAGE_REQUESTS)) {
        items.push({
            label: locale === 'en' ? 'Requests' : 'الطلبات',
            href: '/admin/requests',
            active: currentPath?.startsWith('/admin/requests'),
            permission: PERMISSIONS.MANAGE_REQUESTS,
        });
    }

    if (hasPermission(PERMISSIONS.MANAGE_USERS)) {
        items.push({
            label: locale === 'en' ? 'Users' : 'المستخدمون',
            href: '/admin/users',
            active: currentPath === '/admin/users',
            permission: PERMISSIONS.MANAGE_USERS,
        });
    }

    if (hasPermission(PERMISSIONS.VIEW_LOGS)) {
        items.push({
            label: locale === 'en' ? 'Activity Logs' : 'سجل النشاط',
            href: '/admin/activity',
            active: currentPath === '/admin/activity',
            permission: PERMISSIONS.VIEW_LOGS,
        });
    }

    return items;
};
