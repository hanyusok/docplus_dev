import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/appointments - List all appointments
export async function GET(req: NextRequest) {
  const url = new URL(req.url!);
  const patientId = url.searchParams.get('patientId');
  const providerId = url.searchParams.get('providerId');
  const where: any = {};
  if (patientId) where.patientId = patientId;
  if (providerId) where.providerId = providerId;
  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startTime: 'desc' },
  });
  return NextResponse.json(appointments);
}

// POST /api/appointments - Create a new appointment
export async function POST(req: NextRequest) {
  const data = await req.json();
  const appointment = await prisma.appointment.create({
    data,
  });
  return NextResponse.json(appointment, { status: 201 });
} 