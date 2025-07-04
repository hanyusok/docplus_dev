import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// POST /api/notifications/test - Create a test notification
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create a test notification
    const testNotification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'general',
        title: 'Test Notification',
        message: 'This is a test notification to verify the API is working correctly.',
        isRead: false,
        isUrgent: false,
      },
    });

    return NextResponse.json({
      message: 'Test notification created successfully',
      notification: testNotification,
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    return NextResponse.json(
      { error: 'Failed to create test notification' },
      { status: 500 }
    );
  }
}

// GET /api/notifications/test - Get test notifications count
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get count of notifications for the user
    const count = await prisma.notification.count({
      where: { userId: session.user.id },
    });

    // Get recent notifications
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      count,
      recentNotifications: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
} 