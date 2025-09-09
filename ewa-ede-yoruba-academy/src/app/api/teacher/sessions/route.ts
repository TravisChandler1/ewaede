import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: Prisma.SessionWhereInput = {
      teacherId: session.user.id,
    };

    if (status) {
      // where.status = status; // Will be available after DB migration
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        course: {
          select: {
            title: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: limit,
    });

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      title: session.title,
      courseTitle: session.course?.title || 'General Session',
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      attendees: session.attendees?.length || 0,
      maxAttendees: 20, // Default max attendees
      status: session.status || 'SCHEDULED',
      meetingUrl: session.meetingUrl,
      description: session.description,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      courseId,
      startTime,
      endTime,
      meetingUrl,
      isRecurring
    } = await request.json();

    // Validate required fields
    if (!title || !courseId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the course belongs to the teacher
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
    }

    const newSession = await prisma.session.create({
      data: {
        title,
        description,
        courseId,
        teacherId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetingUrl,
        isRecurring: isRecurring || false,
        status: 'SCHEDULED',
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    // Create notification for enrolled students
    const enrolledStudents = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    // Create notifications for students
    if (enrolledStudents.length > 0) {
      await prisma.notification.createMany({
        data: enrolledStudents.map(enrollment => ({
          userId: enrollment.user.id,
          type: 'SESSION',
          title: 'New Session Scheduled',
          message: `A new session "${title}" has been scheduled for ${new Date(startTime).toLocaleString()}`,
          link: `/courses/${courseId}`,
        })),
      });
    }

    const formattedSession = {
      id: newSession.id,
      title: newSession.title,
      courseTitle: newSession.course?.title || 'General Session',
      startTime: newSession.startTime.toISOString(),
      endTime: newSession.endTime.toISOString(),
      attendees: 0,
      maxAttendees: 20,
      status: 'scheduled',
      meetingUrl: newSession.meetingUrl,
      description: newSession.description,
    };

    return NextResponse.json(formattedSession, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}