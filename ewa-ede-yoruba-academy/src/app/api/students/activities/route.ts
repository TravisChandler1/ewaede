import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent activities for the student
    // This could include lesson completions, assignments submitted, etc.
    const activities = await prisma.userActivity.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Format activities for the frontend
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      text: activity.activityType,
      time: activity.createdAt.toISOString(),
    }));

    return NextResponse.json({ activities: formattedActivities });
  } catch (error) {
    console.error('Error fetching student activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}