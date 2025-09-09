import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all students with STUDENT role
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentProfile: {
          select: {
            level: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format students with level information
    const formattedStudents = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      level: student.studentProfile?.level || 'NOVICE',
    }));

    return NextResponse.json({ students: formattedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}