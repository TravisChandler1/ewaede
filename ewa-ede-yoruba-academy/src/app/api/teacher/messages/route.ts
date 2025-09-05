import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const messages = await prisma.message.findMany({
      where: {
        recipientId: session.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
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
      senderName: message.sender.name || 'Unknown',
      senderEmail: message.sender.email,
      subject: `Message from ${message.sender.name || 'Unknown'}`,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, content } = await request.json();

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Recipient and content are required' }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        content,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: newMessage.id,
      senderName: newMessage.sender.name,
      senderEmail: newMessage.sender.email,
      recipientName: newMessage.recipient?.name,
      recipientEmail: newMessage.recipient?.email,
      content: newMessage.content,
      isRead: newMessage.isRead,
      createdAt: newMessage.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}