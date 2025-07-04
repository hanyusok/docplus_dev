"use client";

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import VideoConference from '@/components/video/VideoConference';

export default function SessionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  const sessionId = params.sessionId as string;

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Load session data
    loadSessionData();
  }, [session, status, sessionId, router]);

  const loadSessionData = async () => {
    try {
      // TODO: Fetch session data from API
      // For now, we'll use mock data
      setSessionData({
        id: sessionId,
        title: 'Group Consultation',
        status: 'active',
        participants: [],
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/dashboard');
    }
  };

  const handleLeaveSession = () => {
    router.push('/dashboard');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen">
      <VideoConference 
        sessionId={sessionId} 
        onLeave={handleLeaveSession}
      />
    </div>
  );
} 