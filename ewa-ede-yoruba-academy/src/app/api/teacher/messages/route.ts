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
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    // Verify the receiver is a student
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        role: 'STUDENT',
      },
    });

    if (!receiver) {
      return NextResponse.json({ error: 'Invalid student' }, { status: 400 });
    }

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

    return NextResponse.json(formattedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending teacher message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}