import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients/[id]/prescriptions - List all prescriptions for a patient
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: params.id },
    orderBy: { prescribedAt: 'desc' },
  });
  return NextResponse.json(prescriptions);
}

// POST /api/patients/[id]/prescriptions - Create a new prescription for a patient
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const prescription = await prisma.prescription.create({
    data: {
      ...data,
      patientId: params.id,
    },
  });
  return NextResponse.json(prescription, { status: 201 });
} 