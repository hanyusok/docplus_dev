import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startTime, sessionType = 'group' } = body;

    if (!title || !startTime) {
      return NextResponse.json(
        { error: 'Title and start time are required' },
        { status: 400 }
      );
    }

    // Create session
    const newSession = await prisma.session.create({
      data: {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        sessionType: sessionType as any,
        startTime: new Date(startTime),
        hostId: session.user.id,
        maxParticipants: 10,
        allowRecording: true,
        allowScreenSharing: true,
        allowChat: true,
        waitingRoomEnabled: true,
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userType = session.user.userType;

    let whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    // Filter sessions based on user type
    if (userType === 'doctor') {
      whereClause.hostId = session.user.id;
    } else if (userType === 'patient') {
      // For patients, show sessions they can join
      whereClause.status = 'waiting';
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        host: {
          select: {
            firstName: true,
            lastName: true,
            userType: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                userType: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 