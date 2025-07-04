import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/schedule/slots?providerId=...&date=... - List available time slots for a provider by date
export async function GET(req: NextRequest) {
  const url = new URL(req.url!);
  const providerId = url.searchParams.get('providerId');
  const date = url.searchParams.get('date');
  if (!providerId || !date) return NextResponse.json([], { status: 400 });
  const start = new Date(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  const slots = await prisma.timeSlot.findMany({
    where: {
      schedule: { providerId },
      startTime: { gte: start, lt: end },
      isAvailable: true,
      isBooked: false,
    },
    orderBy: { startTime: 'asc' },
  });
  return NextResponse.json(slots);
}

// POST /api/schedule/slots - Create new time slots (for provider setup)
export async function POST(req: NextRequest) {
  const data = await req.json();
  const slot = await prisma.timeSlot.create({ data });
  return NextResponse.json(slot, { status: 201 });
} 