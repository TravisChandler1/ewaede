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
    const limit = parseInt(searchParams.get('limit') || '20');
    const studentId = searchParams.get('studentId');

    const whereCondition: Prisma.MessageWhereInput = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id }
      ]
    };

    // If studentId is provided, filter messages for that specific student
    if (studentId) {
      whereCondition.AND = {
        OR: [
          { senderId: session.user.id, recipientId: studentId },
          { senderId: studentId, recipientId: session.user.id }
        ]
      };
    }

    const messages = await prisma.message.findMany({
      where: whereCondition,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      senderName: message.sender.name,
      senderEmail: message.sender.email,
      senderRole: message.sender.role,
      recipientName: message.recipient?.name,
      recipientEmail: message.recipient?.email,
      recipientRole: message.recipient?.role,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching teacher messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/teacher/messages - Starting request');
    console.log('Environment check - NODE_ENV:', process.env.NODE_ENV);
    console.log('Environment check - DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('Environment check - NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

    const session = await auth();
    console.log('Session retrieved:', { userId: session?.user?.id, role: session?.user?.role });

    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      console.log('Unauthorized: session invalid or not teacher');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      console.log('Validation failed: missing receiverId or content');
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    console.log('Verifying receiver:', receiverId);

    // Verify the receiver is a student
    console.log('Database check - Attempting to find receiver');
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        role: 'STUDENT',
      },
    });
    console.log('Database check - Receiver query completed');

    console.log('Receiver found:', receiver ? { id: receiver.id, name: receiver.name, role: receiver.role } : 'null');

    if (!receiver) {
      console.log('Invalid student - receiver not found or not a student');
      return NextResponse.json({ error: 'Invalid student' }, { status: 400 });
    }

    console.log('Creating message with data:', {
      senderId: session.user.id,
      recipientId: receiverId,
      content: content.trim(),
    });

    console.log('Database check - Attempting to create message');
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: receiverId,
        content: content.trim(),
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    console.log('Database check - Message creation completed');

    console.log('Message created successfully:', { id: message.id, content: message.content });

    const formattedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      senderName: message.sender.name,
      senderEmail: message.sender.email,
      senderRole: message.sender.role,
      recipientName: message.recipient?.name,
      recipientEmail: message.recipient?.email,
      recipientRole: message.recipient?.role,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    };

    console.log('Returning formatted message');
    return NextResponse.json(formattedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending teacher message:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}