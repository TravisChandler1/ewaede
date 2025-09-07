import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to enroll in a course' },
        { status: 401 }
      );
    }

    const { id: courseId } = await params;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or not available for enrollment' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json({ message: 'Enrolled successfully' }, { status: 201 });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
