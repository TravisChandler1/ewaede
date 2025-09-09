import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all enrolled students for teacher's courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: session.user.id,
        },
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    // Get recent messages for each student
    const studentIds = enrollments.map(e => e.userId);
    const recentMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: { in: studentIds }, recipientId: session.user.id },
          { senderId: session.user.id, recipientId: { in: studentIds } }
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Get recent messages
    });

    // Group messages by student
    const messagesByStudent = new Map();
    recentMessages.forEach(message => {
      const studentId = message.senderId === session.user.id ? message.recipientId : message.senderId;
      if (studentId && !messagesByStudent.has(studentId)) {
        messagesByStudent.set(studentId, {
          content: message.content,
          timestamp: message.createdAt.toISOString(),
        });
      }
    });

    // Format students with their course and last message info
    const students = enrollments.map(enrollment => {
      const lastMessage = messagesByStudent.get(enrollment.userId);
      return {
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        courseTitle: enrollment.course.title,
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.timestamp,
      };
    });

    // Remove duplicates (students might be enrolled in multiple courses)
    const uniqueStudents = students.filter((student, index, self) =>
      index === self.findIndex(s => s.id === student.id)
    );

    return NextResponse.json({ students: uniqueStudents });
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}