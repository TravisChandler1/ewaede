import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(_request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teachers of courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
                teacherProfile: {
                  select: {
                    bio: true,
                    specialization: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract unique teachers
    const teacherMap = new Map();
    enrollments.forEach(enrollment => {
      const teacher = enrollment.course.instructor;
      if (teacher && !teacherMap.has(teacher.id)) {
        teacherMap.set(teacher.id, {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          courseTitle: enrollment.course.title,
          bio: teacher.teacherProfile?.bio,
          specialization: teacher.teacherProfile?.specialization,
        });
      }
    });

    const teachers = Array.from(teacherMap.values());

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Error fetching student teachers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}