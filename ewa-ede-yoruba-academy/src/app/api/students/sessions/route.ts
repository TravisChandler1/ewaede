import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get upcoming sessions for courses the student is enrolled in
    const sessions = await prisma.session.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              userId: session.user.id,
              status: 'ACTIVE',
            },
          },
        },
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    });

    // Format sessions for the frontend
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      time: session.startTime.toLocaleString(),
      type: session.level || 'General',
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}