import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients/[id] - Get patient detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const patient = await prisma.user.findUnique({
    where: { id: params.id, userType: 'patient' },
  });
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(patient);
}

// PUT /api/patients/[id] - Update patient
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const patient = await prisma.user.update({
    where: { id: params.id, userType: 'patient' },
    data,
  });
  return NextResponse.json(patient);
} 