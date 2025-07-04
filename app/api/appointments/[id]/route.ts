import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/appointments/[id] - Get appointment detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
  });
  if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(appointment);
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const appointment = await prisma.appointment.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(appointment);
} 