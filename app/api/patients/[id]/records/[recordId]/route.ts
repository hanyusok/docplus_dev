import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients/[id]/records/[recordId] - Get a specific medical record
export async function GET(req: NextRequest, { params }: { params: { id: string, recordId: string } }) {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: params.recordId, patientId: params.id },
  });
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

// PUT /api/patients/[id]/records/[recordId] - Update a medical record
export async function PUT(req: NextRequest, { params }: { params: { id: string, recordId: string } }) {
  const data = await req.json();
  const record = await prisma.medicalRecord.update({
    where: { id: params.recordId, patientId: params.id },
    data,
  });
  return NextResponse.json(record);
} 