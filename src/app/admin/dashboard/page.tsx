'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, useLocale } from '@/hooks';
import { DonutChart } from '@/components/ui/DonutChart';
import { LineChart } from '@/components/ui/LineChart';

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
        applicantEmail?: string;
        status: string;
        requestType: string;
        dateOfVisit?: string;
        createdAt: string;
    }>;
}

interface ChartData {
    lineChart: Array<{
        date: string;
        approved: number;
        rejected: number;
        pending: number;
    }>;
    pieChart: Array<{
        name: string;
        value: number;
    }>;
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { locale } = useLocale();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [chartLoading, setChartLoading] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
    const [chartTimeFilter, setChartTimeFilter] = useState<'day' | 'week' | 'month'>('day');
    const [searchQuery, setSearchQuery] = useState('');

    // Helper function to check if user has a specific permission
    const hasPermission = (permissionKey: string) => {
        if (!user) return false;
        if (user.role === 'SUPER_ADMIN') return true;
        return user.permissions?.includes(permissionKey) || false;
    };

    // Calculate percentage change (mock calculation for now)
    const calculatePercentageChange = (current: number, previous: number = current * 0.9) => {
        if (previous === 0) return 0;
        const change = ((current - previous) / previous) * 100;
        return change;
    };

    const fetchDashboardData = useCallback(async (token: string) => {
        setLoading(true);
        setPermissionDenied(false);
        try {
            const summaryResponse = await fetch('/api/admin/dashboard/summary', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (summaryResponse.status === 403) {
                setPermissionDenied(true);
                return;
            }

            if (!summaryResponse.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const summaryResult = await summaryResponse.json();
            setData(summaryResult.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchChartData = useCallback(async (token: string, filter: 'day' | 'week' | 'month') => {
        setChartLoading(true);
        try {
            // Calculate days based on filter
            let days = 30;
            switch (filter) {
                case 'day':
                    days = 1;
                    break;
                case 'week':
                    days = 7;
                    break;
                case 'month':
                    days = 30;
                    break;
            }

            const chartsResponse = await fetch(`/api/admin/dashboard/charts?days=${days}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (chartsResponse.status === 403) {
                setChartData(null);
                return;
            }

            if (!chartsResponse.ok) {
                throw new Error('Failed to fetch chart data');
            }

            const chartsResult = await chartsResponse.json();
            setChartData(chartsResult.data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
            setChartData(null);
        } finally {
            setChartLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        fetchDashboardData(token);
        fetchChartData(token, chartTimeFilter);
    }, [user, fetchDashboardData, fetchChartData, chartTimeFilter]);

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

    const getRequestTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            VISITOR: 'Visitor',
            CONTRACTOR: 'Contractor',
            EMPLOYEE: 'Employee',
            VEHICLE: 'Vehicle',
        };
        return types[type] || type;
    };

    const getStatusLabel = (status: string) => {
        const statuses: Record<string, string> = {
            APPROVED: 'Approved',
            REJECTED: 'Rejected',
            PENDING: 'Pending',
        };
        return statuses[status] || status;
    };

    // Filter requests based on time filter
    const getFilteredRequests = () => {
        if (!data?.recentRequests) return [];
        
        const now = new Date();
        const filterDate = new Date();
        
        switch (timeFilter) {
            case 'day':
                filterDate.setDate(now.getDate() - 1);
                break;
            case 'week':
                filterDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(now.getMonth() - 1);
                break;
        }

        return data.recentRequests.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate >= filterDate;
        });
    };

    // Get requests for table
    const [tableRequests, setTableRequests] = useState<any[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    
    const fetchTableRequests = useCallback(async (token: string) => {
        setTableLoading(true);
        try {
            // Calculate date range based on time filter
            const now = new Date();
            const dateFrom = new Date();
            
            switch (timeFilter) {
                case 'day':
                    dateFrom.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    dateFrom.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    dateFrom.setMonth(now.getMonth() - 1);
                    break;
            }

            const params = new URLSearchParams({
                limit: '10',
                dateFrom: dateFrom.toISOString(),
                dateTo: now.toISOString(),
                filterBy: 'createdAt', // Filter by creation date for dashboard table
            });

            const response = await fetch(`/api/admin/requests?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (response.ok) {
                const result = await response.json();
                setTableRequests(result.data?.requests || []);
            } else {
                console.error('Failed to fetch table requests:', response.statusText);
                setTableRequests([]);
            }
        } catch (error) {
            console.error('Error fetching table requests:', error);
            setTableRequests([]);
        } finally {
            setTableLoading(false);
        }
    }, [timeFilter]);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        fetchTableRequests(token);
    }, [user, timeFilter, fetchTableRequests]);

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

    if (permissionDenied) {
        return (
            <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">You do not have permission to view the dashboard.</h3>
                <p className="text-gray-500">Please contact your administrator if you believe this is a mistake.</p>
            </div>
        );
    }

    const visitorsCount = data?.summary.total || 0;
    const approvedCount = data?.summary.approved || 0;
    const pendingCount = data?.summary.pending || 0;
    const rejectedCount = data?.summary.rejected || 0;

    // Calculate percentage changes (using mock previous values for now)
    const visitorsChange = calculatePercentageChange(visitorsCount);
    const approvedChange = calculatePercentageChange(approvedCount);
    const pendingChange = calculatePercentageChange(pendingCount);
    const rejectedChange = calculatePercentageChange(rejectedCount);

    // Prepare donut chart data
    const donutData = [
        {
            name: 'Approved',
            value: approvedCount,
            color: '#14b8a6', // teal
        },
        {
            name: 'Rejected',
            value: rejectedCount,
            color: '#ef4444', // red
        },
    ];
    const totalApplications = approvedCount + rejectedCount + pendingCount;

    // Prepare line chart data - aggregate based on time filter
    const lineChartData = chartData?.lineChart || [];
    const aggregatedData = new Map<string, { visits: number; requests: number }>();
    
    lineChartData.forEach(item => {
        const date = new Date(item.date);
        let key: string;
        
        // Aggregate based on chart time filter
        if (chartTimeFilter === 'day') {
            // Show daily data
            key = date.toISOString().split('T')[0];
        } else if (chartTimeFilter === 'week') {
            // Show daily data for week view
            key = date.toISOString().split('T')[0];
        } else {
            // Aggregate by month for month view
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
        
        if (!aggregatedData.has(key)) {
            aggregatedData.set(key, { visits: 0, requests: 0 });
        }
        
        const data = aggregatedData.get(key)!;
        data.visits += item.approved + item.pending;
        data.requests += item.approved + item.rejected + item.pending;
    });
    
    const formattedLineData = Array.from(aggregatedData.entries())
        .map(([key, data]) => ({
            date: chartTimeFilter === 'month' ? `${key}-01` : key, // Use first day of month for month view, actual date for day/week
            visits: data.visits,
            requests: data.requests,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="space-y-6">
            {/* Top Header with Search and User Profile */}
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'System admin'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Visitors Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className={`flex items-center gap-1 ${visitorsChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {visitorsChange >= 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold">{Math.abs(visitorsChange).toFixed(2)}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Visitors</p>
                    <p className="text-3xl font-bold text-gray-900">{visitorsCount.toLocaleString()}</p>
                </div>

                {/* Approved Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className={`flex items-center gap-1 ${approvedChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {approvedChange >= 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold">{Math.abs(approvedChange).toFixed(2)}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Approved</p>
                    <p className="text-3xl font-bold text-gray-900">{approvedCount.toLocaleString()}</p>
                </div>

                {/* Pending Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className={`flex items-center gap-1 ${pendingChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {pendingChange >= 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold">{Math.abs(pendingChange).toFixed(2)}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{pendingCount.toLocaleString()}</p>
                </div>

                {/* Rejected Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className={`flex items-center gap-1 ${rejectedChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {rejectedChange >= 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold">{Math.abs(rejectedChange).toFixed(2)}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-gray-900">{rejectedCount.toLocaleString()}</p>
                </div>
            </div>

            {/* Middle Section: Requests Table and Donut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Requests Table - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Requests</h2>
                        <div className="flex items-center gap-2">
                            {['day', 'week', 'month'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter as 'day' | 'week' | 'month')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        timeFilter === filter
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Full Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Visit Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tableLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                                <span>Loading requests...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : tableRequests.length > 0 ? (
                                    tableRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                <Link href={`/admin/requests/${request.id}`} className="text-primary-600 hover:text-primary-700">
                                                    {request.requestNumber?.replace('REQ-', '') || request.id}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{request.applicantName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{request.applicantEmail || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{getRequestTypeLabel(request.requestType)}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {getStatusLabel(request.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {request.dateOfVisit ? new Date(request.dateOfVisit).toLocaleDateString('en-US', { 
                                                    month: 'numeric', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                }).replace(/\//g, '/') : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(request.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'numeric', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                }).replace(/\//g, '/')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No requests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Visitors Applications Card with Donut Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Visitors Applications Card</h2>
                    <p className="text-sm text-gray-600 mb-6">{totalApplications} Total applications</p>
                    
                    {totalApplications > 0 ? (
                        <>
                            <div className="flex justify-center mb-6">
                                <DonutChart
                                    data={donutData}
                                    total={totalApplications}
                                    size={180}
                                    strokeWidth={25}
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                        <span className="text-sm text-gray-600">Approved</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{approvedCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-600">Rejected</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{rejectedCount}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No applications yet
                        </div>
                    )}
                </div>
            </div>

            {/* Activities Of Action Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Activities Of Action</h2>
                    <div className="flex items-center gap-2">
                        {['day', 'week', 'month'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setChartTimeFilter(filter as 'day' | 'week' | 'month');
                                    const token = localStorage.getItem('token');
                                    if (token) {
                                        fetchChartData(token, filter as 'day' | 'week' | 'month');
                                    }
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    chartTimeFilter === filter
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                        <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {chartLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center gap-2 text-gray-500">
                            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            <span>Loading chart data...</span>
                        </div>
                    </div>
                ) : formattedLineData.length > 0 ? (
                    <LineChart
                        data={formattedLineData}
                        lines={[
                            { key: 'visits', label: 'Visits', color: '#2563eb', dataKey: 'visits' },
                            { key: 'requests', label: 'Requests', color: '#22c55e', dataKey: 'requests' },
                        ]}
                        height={300}
                    />
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        No chart data available for the selected period
                    </div>
                )}
            </div>
        </div>
    );
}
