import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/notifications/debug - Debug endpoint to check session and database
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check session
    const sessionInfo = {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        userType: session.user.userType
      } : null
    };

    // Check database connection
    const dbConnection = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Count notifications in database
    const totalNotifications = await prisma.notification.count();
    
    // Count users in database
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      session: sessionInfo,
      database: {
        connected: !!dbConnection,
        totalNotifications,
        totalUsers
      },
      message: session ? 'Session found' : 'No session - this is expected when not logged in'
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 