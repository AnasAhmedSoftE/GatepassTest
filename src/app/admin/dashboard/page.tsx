'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useLocale } from '@/hooks';

interface DashboardData {
    summary: {
        total: number;
        approved: number;
        rejected: number;
        pending: number;
    };
    byType: {
        VISITOR: number;
        CONTRACTOR: number;
        EMPLOYEE: number;
        VEHICLE: number;
    };
    recentRequests: Array<{
        id: number;
        requestNumber: string;
        applicantName: string;
        status: string;
        requestType: string;
        createdAt: string;
    }>;
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { locale } = useLocale();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Helper function to check if user has a specific permission
    const hasPermission = (permissionKey: string) => {
        if (!user) return false;
        if (user.role === 'SUPER_ADMIN') return true;
        return user.permissions?.includes(permissionKey) || false;
    };

    const t = {
        en: {
            title: 'Dashboard',
            welcome: 'Welcome back',
            logout: 'Logout',
            summary: 'Summary',
            total: 'Total Requests',
            approved: 'Approved',
            rejected: 'Rejected',
            pending: 'Pending',
            byType: 'Requests by Type',
            recent: 'Recent Requests',
            viewAll: 'View All Requests',
            requests: 'Requests',
            users: 'Users',
            logs: 'Activity Logs',
            noRequests: 'No recent requests',
            permissionDenied: 'You do not have permission to view the dashboard.',
            contactAdmin: 'Please contact your administrator if you believe this is a mistake.',
            types: {
                VISITOR: 'Visitor',
                CONTRACTOR: 'Contractor',
                EMPLOYEE: 'Employee',
                VEHICLE: 'Vehicle',
            },
            status: {
                PENDING: 'Pending',
                APPROVED: 'Approved',
                REJECTED: 'Rejected',
            },
        },
        ar: {
            title: 'لوحة التحكم',
            welcome: 'مرحباً بعودتك',
            logout: 'تسجيل الخروج',
            summary: 'ملخص',
            total: 'إجمالي الطلبات',
            approved: 'موافق عليها',
            rejected: 'مرفوضة',
            pending: 'قيد الانتظار',
            byType: 'الطلبات حسب النوع',
            recent: 'الطلبات الأخيرة',
            viewAll: 'عرض جميع الطلبات',
            requests: 'الطلبات',
            users: 'المستخدمون',
            logs: 'سجل النشاط',
            noRequests: 'لا توجد طلبات حديثة',
            permissionDenied: 'ليس لديك صلاحية لعرض لوحة التحكم.',
            contactAdmin: 'يرجى الاتصال بالمسؤول إذا كنت تعتقد أن هذا خطأ.',
            types: {
                VISITOR: 'زائر',
                CONTRACTOR: 'مقاول',
                EMPLOYEE: 'موظف',
                VEHICLE: 'مركبة',
            },
            status: {
                PENDING: 'قيد الانتظار',
                APPROVED: 'موافق عليه',
                REJECTED: 'مرفوض',
            },
        },
    };

    const content = t[locale];

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        fetchDashboardData(token);
    }, [user]);

    const fetchDashboardData = async (token: string) => {
        setLoading(true);
        setPermissionDenied(false);
        try {
            const response = await fetch('/api/admin/dashboard/summary', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 403) {
                setPermissionDenied(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Logout is now handled by AdminLayout

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-success-100 text-success-700';
            case 'REJECTED':
                return 'bg-danger-100 text-danger-700';
            case 'PENDING':
                return 'bg-warning-100 text-warning-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading && !data && !permissionDenied) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                    {content.welcome}, {user?.name}!
                </h1>
                <p className="text-gray-600">Here&apos;s an overview of your gate pass system</p>
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
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">{content.total}</p>
                                    <p className="text-4xl font-bold text-gray-900">{data?.summary.total || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">{content.approved}</p>
                                    <p className="text-4xl font-bold text-success-600">{data?.summary.approved || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">{content.rejected}</p>
                                    <p className="text-4xl font-bold text-danger-600">{data?.summary.rejected || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-danger-100 to-danger-200 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card hover:shadow-card-hover transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">{content.pending}</p>
                                    <p className="text-4xl font-bold text-warning-600">{data?.summary.pending || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests by Type */}
                    <div className="card mb-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{content.byType}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(data?.byType || {}).map(([type, count]) => (
                                <div key={type} className="text-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                    <p className="text-3xl font-bold text-gray-900 mb-1">{count}</p>
                                    <p className="text-sm font-medium text-gray-600">{content.types[type as keyof typeof content.types]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div className="card shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{content.recent}</h2>
                            <Link href="/admin/requests" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 transition-colors">
                                {content.viewAll}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {data?.recentRequests && data.recentRequests.length > 0 ? (
                            <div className="overflow-x-auto -mx-6 px-6">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Request #</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.recentRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/requests/${request.id}`} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                                        {request.requestNumber}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-medium">{request.applicantName}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {content.types[request.requestType as keyof typeof content.types]}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(request.status)}`}>
                                                        {content.status[request.status as keyof typeof content.status]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">{content.noRequests}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
