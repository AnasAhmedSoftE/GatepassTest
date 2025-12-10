import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/middleware/api';

// GET /api/admin/logs - Get activity logs with pagination and filters
export const GET = withAuth(async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const actionType = searchParams.get('actionType') || '';
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (actionType) {
            where.actionType = actionType;
        }

        if (search) {
            where.actionPerformed = {
                contains: search,
            };
        }

        // Fetch logs with user information
        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    timestamp: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.activityLog.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
        });
    } catch (error: any) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error', message: 'Failed to fetch activity logs' },
            { status: 500 }
        );
    }
});
