import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// POST /api/notifications/[id]/read - Mark a notification as read
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const notification = await prisma.notification.update({
    where: { id: params.id, userId: session.user.id },
    data: { isRead: true },
  });
  return NextResponse.json(notification);
} 