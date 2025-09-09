import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: {
        instructorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      enrolledStudents: course._count.enrollments,
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}