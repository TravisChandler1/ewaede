import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verify admin access
    if (session?.user.role !== 'ADMIN') {
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

      // Create audit log
      await prisma.adminAuditLog.create({
        data: {
          action: 'TEACHER_APPROVED',
          entityType: 'TEACHER',
          entityId: teacherId,
          performedBy: session.user.id,
          newData: { status: 'APPROVED' }
        }
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

      // Create audit log
      await prisma.adminAuditLog.create({
        data: {
          action: 'TEACHER_REJECTED',
          entityType: 'TEACHER',
          entityId: teacherId,
          performedBy: session.user.id,
          newData: { 
            status: 'REJECTED',
            rejectionReason: rejectionReason || 'No reason provided'
          }
        }
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
