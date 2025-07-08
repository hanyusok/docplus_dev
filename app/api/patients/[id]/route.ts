import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/patients/[id] - Get patient detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Allow patients to view their own profile or doctors/admins to view any patient
  if (session.user.userType === 'patient' && session.user.id !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (session.user.userType !== 'patient' && session.user.userType !== 'doctor' && session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const patient = await prisma.user.findUnique({
    where: { id: params.id, userType: 'patient' },
  });
  
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(patient);
}

// PUT /api/patients/[id] - Update patient
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Allow patients to update their own profile or doctors/admins to update any patient
  if (session.user.userType === 'patient' && session.user.id !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (session.user.userType !== 'patient' && session.user.userType !== 'doctor' && session.user.userType !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await req.json();
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, userType, isActive, isVerified, ...updateData } = data;
    
    const patient = await prisma.user.update({
      where: { id: params.id, userType: 'patient' },
      data: updateData,
    });
    
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
} 