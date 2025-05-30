
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalTasks,
      pendingTasks,
      resolvedTasks,
      urgentTasks,
      tasksByCategory,
      tasksByUrgency,
      recentTasks
    ] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'PENDING' } }),
      prisma.task.count({ where: { status: 'RESOLVED' } }),
      prisma.task.count({ where: { urgency: 'URGENT', status: 'PENDING' } }),
      prisma.task.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { status: 'PENDING' }
      }),
      prisma.task.groupBy({
        by: ['urgency'],
        _count: { id: true },
        where: { status: 'PENDING' }
      }),
      prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { status: 'PENDING' }
      })
    ]);

    return NextResponse.json({
      totalTasks,
      pendingTasks,
      resolvedTasks,
      urgentTasks,
      tasksByCategory,
      tasksByUrgency,
      recentTasks
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
