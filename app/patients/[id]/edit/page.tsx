"use client";

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import PatientProfileForm from '@/components/patients/PatientProfileForm';

export default function PatientEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Allow patients to edit their own profile or doctors/admins to edit any patient
    if (session.user.userType === 'patient') {
      // Patients can only edit their own profile
      if (session.user.id !== patientId) {
        router.push('/patient/dashboard');
        return;
      }
    } else if (session.user.userType !== 'doctor' && session.user.userType !== 'admin') {
      // Only patients, doctors, and admins can access this page
      router.push('/dashboard');
      return;
    }
  }, [session, status, router, patientId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSuccess = () => {
    if (session.user.userType === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push(`/patients/${patientId}`);
    }
  };

  const handleCancel = () => {
    if (session.user.userType === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push(`/patients/${patientId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PatientProfileForm 
            patientId={patientId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
} 