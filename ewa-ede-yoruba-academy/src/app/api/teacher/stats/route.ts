import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher statistics
    const teacherId = session.user.id;

    // Count total students (users with STUDENT role)
    const totalStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
      },
    });

    // Count active courses
    const activeCourses = await prisma.course.count({
      where: {
        instructorId: teacherId,
        isPublished: true,
      },
    });

    // Count upcoming sessions
    const upcomingSessions = await prisma.session.count({
      where: {
        teacherId: teacherId,
        startTime: {
          gte: new Date(),
        },
      },
    });

    // Count total sessions
    const totalSessions = await prisma.session.count({
      where: {
        teacherId: teacherId,
      },
    });

    // Calculate average rating (placeholder - would need rating system)
    const averageRating = 4.5; // Placeholder value

    // Calculate monthly revenue (placeholder - would need payment system)
    const monthlyRevenue = 0; // Placeholder value

    return NextResponse.json({
      totalStudents,
      activeCourses,
      upcomingSessions,
      totalSessions,
      averageRating,
      monthlyRevenue,
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}