
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UrgencyLevel, TaskCategory, TaskStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const urgency = searchParams.get('urgency') as UrgencyLevel | null;
    const category = searchParams.get('category') as TaskCategory | null;
    const status = searchParams.get('status') as TaskStatus | null;
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: any = {};

    if (urgency) where.urgency = urgency;
    if (category) where.category = category;
    if (status) where.status = status;
    
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { requester: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { urgency: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, requester, urgency, category } = body;

    if (!description || !requester || !urgency || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        description,
        requester,
        urgency,
        category
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
