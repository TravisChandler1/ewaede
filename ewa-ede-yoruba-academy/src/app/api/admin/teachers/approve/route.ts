import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    // Verify admin access
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { teacherId, action, rejectionReason } = await req.json();

    if (!teacherId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the teacher
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: 'PENDING_TEACHER' },
      include: { teacherProfile: true }
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found or already processed' },
        { status: 404 }
      );
    }

    // Handle approval/rejection
    if (action === 'APPROVE') {
      // Update user role to TEACHER
      await prisma.$transaction([
        prisma.user.update({
          where: { id: teacherId },
          data: { role: 'TEACHER' }
        }),
        prisma.teacherProfile.update({
          where: { userId: teacherId },
          data: { 
            status: 'APPROVED',
            isVerified: true,
            reviewedAt: new Date()
          }
        })
      ]);

      // Log admin action
      await prisma.adminActionLog.create({
        data: {
          adminId: user.id,
          action: 'APPROVE_TEACHER',
          targetId: teacherId,
          metadata: {
            rejectionReason: undefined,
          },
        },
      });

      // TODO: Send approval email

      return NextResponse.json({ 
        message: 'Teacher approved successfully',
        teacherId 
      });

    } else if (action === 'REJECT') {
      // Update teacher profile with rejection
      await prisma.teacherProfile.update({
        where: { userId: teacherId },
        data: { 
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'No reason provided',
          reviewedAt: new Date()
        }
      });

      // Send notification to teacher
      await prisma.notification.create({
        data: {
          userId: teacherId,
          title: 'Teacher Application Rejected',
          message: `Your teacher application has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
          type: 'TEACHER_APPLICATION_UPDATE',
          metadata: {
            action: 'reject',
            rejectionReason: rejectionReason,
          },
        },
      });

      // Log admin action
      await prisma.adminActionLog.create({
        data: {
          adminId: user.id,
          action: 'REJECT_TEACHER',
          targetId: teacherId,
          metadata: {
            rejectionReason: rejectionReason,
          },
        },
      });

      // TODO: Send rejection email

      return NextResponse.json({ 
        message: 'Teacher application rejected',
        teacherId 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing teacher approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
