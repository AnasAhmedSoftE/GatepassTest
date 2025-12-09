'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, useLocale } from '@/hooks';

interface Request {
    id: number;
    requestNumber: string;
    applicantName: string;
    applicantEmail: string;
    passportIdNumber: string;
    purposeOfVisit: string;
    dateOfVisit: string;
    requestType: string;
    status: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminRequestsPage() {
    const { user } = useAuth();
    const { locale } = useLocale();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<Request[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        requestType: '',
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
            title: 'Gate Pass Requests',
            dashboard: 'Dashboard',
            requests: 'Requests',
            users: 'Users',
            logs: 'Activity Logs',
            logout: 'Logout',
            search: 'Search by name, email, or request number...',
            filterStatus: 'Filter by Status',
            filterType: 'Filter by Type',
            allStatuses: 'All Statuses',
            allTypes: 'All Types',
            showing: 'Showing',
            of: 'of',
            results: 'results',
            previous: 'Previous',
            next: 'Next',
            noRequests: 'No requests found',
            viewDetails: 'View Details',
            permissionDenied: 'You do not have permission to view requests.',
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
            title: 'طلبات تصاريح البوابة',
            dashboard: 'لوحة التحكم',
            requests: 'الطلبات',
            users: 'المستخدمون',
            logs: 'سجل النشاط',
            logout: 'تسجيل الخروج',
            search: 'البحث بالاسم أو البريد الإلكتروني أو رقم الطلب...',
            filterStatus: 'تصفية حسب الحالة',
            filterType: 'تصفية حسب النوع',
            allStatuses: 'جميع الحالات',
            allTypes: 'جميع الأنواع',
            showing: 'عرض',
            of: 'من',
            results: 'نتيجة',
            previous: 'السابق',
            next: 'التالي',
            noRequests: 'لم يتم العثور على طلبات',
            viewDetails: 'عرض التفاصيل',
            permissionDenied: 'ليس لديك صلاحية لعرض الطلبات.',
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

    const fetchRequests = useCallback(async (token: string) => {
        setLoading(true);
        setPermissionDenied(false);
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.requestType) params.append('requestType', filters.requestType);
            if (filters.search) params.append('search', filters.search);
            params.append('page', filters.page.toString());
            params.append('limit', '20');

            const response = await fetch(`/api/admin/requests?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 403) {
                setPermissionDenied(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }

            const result = await response.json();
            setRequests(result.data.requests);
            setPagination(result.data.pagination);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (!user) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        fetchRequests(token);
    }, [filters, user, fetchRequests]);

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

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (loading && requests.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{content.title}</h1>
                    <p className="text-gray-600">Manage and review all gate pass requests</p>
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
                        <div className="card mb-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="input"
                                    >
                                        <option value="">{content.allStatuses}</option>
                                        <option value="PENDING">{content.status.PENDING}</option>
                                        <option value="APPROVED">{content.status.APPROVED}</option>
                                        <option value="REJECTED">{content.status.REJECTED}</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filters.requestType}
                                        onChange={(e) => handleFilterChange('requestType', e.target.value)}
                                        className="input"
                                    >
                                        <option value="">{content.allTypes}</option>
                                        <option value="VISITOR">{content.types.VISITOR}</option>
                                        <option value="CONTRACTOR">{content.types.CONTRACTOR}</option>
                                        <option value="EMPLOYEE">{content.types.EMPLOYEE}</option>
                                        <option value="VEHICLE">{content.types.VEHICLE}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Requests Table */}
                        <div className="card shadow-sm">
                            {requests.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto -mx-6 px-6">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Request #</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applicant</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Visit Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {requests.map((request) => (
                                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <Link href={`/admin/requests/${request.id}`} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                                                {request.requestNumber}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-900 font-medium">{request.applicantName}</td>
                                                        <td className="px-6 py-4 text-gray-600">{request.applicantEmail}</td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {content.types[request.requestType as keyof typeof content.types]}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                                            {new Date(request.dateOfVisit).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(request.status)}`}>
                                                                {content.status[request.status as keyof typeof content.status]}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Link
                                                                href={`/admin/requests/${request.id}`}
                                                                className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
                                                            >
                                                                {content.viewDetails}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                                            <div className="text-sm text-gray-600 font-medium">
                                                {content.showing} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {content.of} {pagination.total} {content.results}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePageChange(pagination.page - 1)}
                                                    disabled={pagination.page === 1}
                                                    className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={content.previous}
                                                >
                                                    {content.previous}
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(pagination.page + 1)}
                                                    disabled={pagination.page === pagination.totalPages}
                                                    className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={content.next}
                                                >
                                                    {content.next}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
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
