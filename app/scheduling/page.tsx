"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppointmentScheduler from '@/components/scheduling/AppointmentScheduler';

export default function SchedulingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only allow doctors and admins to access scheduling
    if (session.user.userType !== 'doctor' && session.user.userType !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Schedule Appointments</h1>
            <p className="text-gray-600 mt-2">Create and manage patient appointments</p>
          </div>
          
          <AppointmentScheduler />
        </div>
      </div>
    </div>
  );
} 