import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients/[id]/prescriptions/[prescriptionId] - Get a specific prescription
export async function GET(req: NextRequest, { params }: { params: { id: string, prescriptionId: string } }) {
  const prescription = await prisma.prescription.findUnique({
    where: { id: params.prescriptionId, patientId: params.id },
  });
  if (!prescription) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(prescription);
}

// PUT /api/patients/[id]/prescriptions/[prescriptionId] - Update a prescription
export async function PUT(req: NextRequest, { params }: { params: { id: string, prescriptionId: string } }) {
  const data = await req.json();
  const prescription = await prisma.prescription.update({
    where: { id: params.prescriptionId, patientId: params.id },
    data,
  });
  return NextResponse.json(prescription);
} 