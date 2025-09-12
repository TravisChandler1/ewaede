import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Get all sessions for courses the student is enrolled in
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
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Categorize sessions into live and scheduled
    const liveSessions = sessions.filter(session =>
      session.startTime <= fiveMinutesFromNow && session.endTime > now
    );

    const scheduledSessions = sessions.filter(session =>
      session.startTime > fiveMinutesFromNow
    );

    // Format sessions for the frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatSession = (session: any) => ({
      id: session.id,
      title: session.title,
      description: session.description || `Session for ${session.course.title}`,
      courseTitle: session.course.title,
      instructorName: session.course.instructor?.name || 'Unknown Instructor',
      instructorEmail: session.course.instructor?.email,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      duration: Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)), // minutes
      level: session.level || 'General',
      maxAttendees: session.maxAttendees || 50,
      currentAttendees: session._count.attendees,
      meetingUrl: session.meetingUrl,
      isLive: session.startTime <= fiveMinutesFromNow && session.endTime > now,
      status: session.status || 'SCHEDULED',
    });

    const formattedLiveSessions = liveSessions.map(formatSession);
    const formattedScheduledSessions = scheduledSessions.map(formatSession);

    return NextResponse.json({
      live: formattedLiveSessions,
      scheduled: formattedScheduledSessions
    });
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}