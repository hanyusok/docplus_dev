import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients - List all patients
export async function GET(req: NextRequest) {
  const patients = await prisma.user.findMany({
    where: { userType: 'patient' },
    orderBy: { lastName: 'asc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      dateOfBirth: true,
      gender: true,
      isActive: true,
      createdAt: true,
      medicalHistory: true,
      allergies: true,
      currentMedications: true,
    },
  });
  return NextResponse.json(patients);
}

// POST /api/patients - Create a new patient
export async function POST(req: NextRequest) {
  const data = await req.json();
  const patient = await prisma.user.create({
    data: {
      ...data,
      userType: 'patient',
    },
  });
  return NextResponse.json(patient, { status: 201 });
} 