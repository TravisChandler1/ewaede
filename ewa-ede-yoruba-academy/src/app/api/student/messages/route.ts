import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id }
        ]
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
    console.error('Error fetching student messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, content } = await request.json();

    if (!recipientId || !content?.trim()) {
      return NextResponse.json({ error: 'Recipient ID and content are required' }, { status: 400 });
    }

    // Verify the recipient is a teacher of courses the student is enrolled in
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        course: {
          instructorId: recipientId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Unauthorized to message this teacher' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
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
    console.error('Error sending student message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}