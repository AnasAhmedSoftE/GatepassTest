'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useLocale } from '@/hooks';

interface ActivityLog {
    id: number;
    timestamp: string;
    userId: number | null;
    actionType: string;
    actionPerformed: string;
    affectedEntityType: string | null;
    affectedEntityId: number | null;
    details: string | null;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminActivityPage() {
    const { user } = useAuth();
    const { locale } = useLocale();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [filters, setFilters] = useState({
        actionType: '',
        search: '',
        page: 1,
    });

    const [permissionDenied, setPermissionDenied] = useState(false);

    // Helper function to check if user has a specific permission
    const hasPermission = (permissionKey: string) => {
        if (!user) return false;
        if (user.role === 'SUPER_ADMIN') return true;
        return user.permissions?.includes(permissionKey) || false;
    };

    const t = {
        en: {
            title: 'Activity Logs',
            dashboard: 'Dashboard',
            requests: 'Requests',
            users: 'Users',
            logs: 'Activity Logs',
            logout: 'Logout',
            search: 'Search in actions...',
            filterType: 'Filter by Type',
            allTypes: 'All Types',
            showing: 'Showing',
            of: 'of',
            results: 'results',
            previous: 'Previous',
            next: 'Next',
            noLogs: 'No activity logs found',
            permissionDenied: 'You do not have permission to view activity logs.',
            contactAdmin: 'Please contact your administrator if you believe this is a mistake.',
            timestamp: 'Timestamp',
            user: 'User',
            action: 'Action',
            type: 'Type',
            system: 'System',
            actionTypes: {
                REQUEST_MANAGEMENT: 'Request Management',
                USER_MANAGEMENT: 'User Management',
                SYSTEM_INTEGRATION: 'System Integration',
                AUTH: 'Authentication',
            },
        },
        ar: {
            title: 'سجل النشاط',
            dashboard: 'لوحة التحكم',
            requests: 'الطلبات',
            users: 'المستخدمون',
            logs: 'سجل النشاط',
            logout: 'تسجيل الخروج',
            search: 'البحث في الإجراءات...',
            filterType: 'تصفية حسب النوع',
            allTypes: 'جميع الأنواع',
            showing: 'عرض',
            of: 'من',
            results: 'نتيجة',
            previous: 'السابق',
            next: 'التالي',
            noLogs: 'لم يتم العثور على سجلات نشاط',
            permissionDenied: 'ليس لديك صلاحية لعرض سجلات النشاط.',
            contactAdmin: 'يرجى الاتصال بالمسؤول إذا كنت تعتقد أن هذا خطأ.',
            timestamp: 'الوقت',
            user: 'المستخدم',
            action: 'الإجراء',
            type: 'النوع',
            system: 'النظام',
            actionTypes: {
                REQUEST_MANAGEMENT: 'إدارة الطلبات',
                USER_MANAGEMENT: 'إدارة المستخدمين',
                SYSTEM_INTEGRATION: 'تكامل النظام',
                AUTH: 'المصادقة',
            },
        },
    };


    const content = t[locale];

    const fetchLogs = useCallback(async (token: string) => {
        setLoading(true);
        setPermissionDenied(false);
        try {
            const params = new URLSearchParams();
            if (filters.actionType) params.append('actionType', filters.actionType);
            if (filters.search) params.append('search', filters.search);
            params.append('page', filters.page.toString());
            params.append('limit', '50');

            const response = await fetch(`/api/admin/logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 403) {
                setPermissionDenied(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }

            const result = await response.json();
            setLogs(result.data.logs);
            setPagination(result.data.pagination);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (!user) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        fetchLogs(token);
    }, [filters, user, fetchLogs]);

    // Logout is now handled by AdminLayout

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const getActionTypeColor = (actionType: string) => {
        switch (actionType) {
            case 'REQUEST_MANAGEMENT':
                return 'bg-primary-100 text-primary-700';
            case 'USER_MANAGEMENT':
                return 'bg-warning-100 text-warning-700';
            case 'SYSTEM_INTEGRATION':
                return 'bg-success-100 text-success-700';
            case 'AUTH':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading && logs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading activity logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{content.title}</h1>
                <p className="text-gray-600">View and monitor all system activity logs</p>
            </div>

                {permissionDenied ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{content.permissionDenied}</h3>
                        <p className="text-gray-500">{content.contactAdmin}</p>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="card mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={content.search}
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={filters.actionType}
                                        onChange={(e) => handleFilterChange('actionType', e.target.value)}
                                        className="input"
                                    >
                                        <option value="">{content.allTypes}</option>
                                        <option value="REQUEST_MANAGEMENT">{content.actionTypes.REQUEST_MANAGEMENT}</option>
                                        <option value="USER_MANAGEMENT">{content.actionTypes.USER_MANAGEMENT}</option>
                                        <option value="SYSTEM_INTEGRATION">{content.actionTypes.SYSTEM_INTEGRATION}</option>
                                        <option value="AUTH">{content.actionTypes.AUTH}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Logs Table */}
                        <div className="card">
                            {logs.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{content.timestamp}</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{content.user}</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{content.type}</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{content.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {logs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {log.user ? (
                                                                <div>
                                                                    <p className="text-gray-900 font-medium">{log.user.name}</p>
                                                                    <p className="text-xs text-gray-500">{log.user.email}</p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 italic">{content.system}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionTypeColor(log.actionType)}`}>
                                                                {content.actionTypes[log.actionType as keyof typeof content.actionTypes] || log.actionType}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {log.actionPerformed}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                                            <div className="text-sm text-gray-600">
                                                {content.showing} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {content.of} {pagination.total} {content.results}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePageChange(pagination.page - 1)}
                                                    disabled={pagination.page === 1}
                                                    className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {content.previous}
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(pagination.page + 1)}
                                                    disabled={pagination.page === pagination.totalPages}
                                                    className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {content.next}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-12">{content.noLogs}</p>
                            )}
                        </div>
                    </>
                )}
        </div>
    );
}
