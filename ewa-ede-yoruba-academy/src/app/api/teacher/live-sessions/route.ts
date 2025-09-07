import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      meetingLink,
      password: _password,
      level,
      startTime,
      duration
    } = await request.json();

    // Validate required fields
    if (!title || !meetingLink || !level || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate meeting link format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(meetingLink)) {
      return NextResponse.json({ error: 'Invalid meeting link format' }, { status: 400 });
    }

    // Calculate end time from start time and duration
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000); // duration in minutes

    // Create the live session
    const liveSession = await prisma.session.create({
      data: {
        title,
        description,
        meetingUrl: meetingLink,
        // meetingPassword: password, // Will be available after DB migration
        // level: level.toUpperCase(), // Will be available after DB migration
        // status: 'SCHEDULED', // Will be available after DB migration
        teacherId: session.user.id,
        startTime: startDateTime,
        endTime: endDateTime,
        isRecurring: false,
      },
    });

    // Find students based on the selected level
    let targetStudents: Array<{ id: string; name: string | null; email: string }>;

    if (level.toLowerCase() === 'all') {
      // Get all students
      targetStudents = await prisma.user.findMany({
        where: {
          role: 'STUDENT',
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } else {
      // Get students with the specific level
      targetStudents = await prisma.studentProfile.findMany({
        where: {
          level: level.toUpperCase(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }).then(profiles => profiles.map(profile => profile.user));
    }

    // Create notifications for target students
    if (targetStudents.length > 0) {
      const notifications = targetStudents.map(student => ({
        userId: student.id,
        type: 'SESSION' as const,
        title: 'New Live Session Available',
        message: `A new live session "${title}" is scheduled for ${startDateTime.toLocaleString()}. Level: ${level}`,
        link: `/dashboard/student`,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: liveSession.id,
        title: liveSession.title,
        description: liveSession.description,
        meetingLink: liveSession.meetingUrl,
        // level: liveSession.level, // Will be available after DB migration
        startTime: liveSession.startTime.toISOString(),
        endTime: liveSession.endTime.toISOString(),
        // status: liveSession.status, // Will be available after DB migration
        notifiedStudents: targetStudents.length,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating live session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const _status = searchParams.get('status') || 'SCHEDULED';
    const limit = parseInt(searchParams.get('limit') || '10');

    const liveSessions = await prisma.session.findMany({
      where: {
        teacherId: session.user.id,
        // status: status as SessionStatus, // Will be available after DB migration
      },
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
    });

    const formattedSessions = liveSessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      meetingLink: session.meetingUrl,
      // level: session.level, // Will be available after DB migration
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      // status: session.status, // Will be available after DB migration
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}