import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients/[id]/records - List all medical records for a patient
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const records = await prisma.medicalRecord.findMany({
    where: { patientId: params.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(records);
}

// POST /api/patients/[id]/records - Create a new medical record for a patient
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const record = await prisma.medicalRecord.create({
    data: {
      ...data,
      patientId: params.id,
    },
  });
  return NextResponse.json(record, { status: 201 });
} 