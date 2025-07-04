"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WaitingRoom from '@/components/waiting-room/WaitingRoom';

function WaitingRoomWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('default-session');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only allow doctors and admins to access waiting room
    if (session.user.userType !== 'doctor' && session.user.userType !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const handleAdmitted = () => {
    // Handle when a participant is admitted to the session
    console.log('Participant admitted to session');
  };

  const handleLeave = () => {
    // Handle when leaving the waiting room
    router.push('/dashboard');
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Waiting Room</h1>
            <p className="text-gray-600 mt-2">Manage patients waiting for their appointments</p>
          </div>
          
          <WaitingRoom 
            sessionId={sessionId}
            onAdmitted={handleAdmitted}
            onLeave={handleLeave}
          />
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomWrapper; 