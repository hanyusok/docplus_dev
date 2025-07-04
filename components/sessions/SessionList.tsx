"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Session {
  id: string;
  sessionId: string;
  title: string;
  status: string;
  startTime: string;
  host: {
    firstName: string;
    lastName: string;
    userType: string;
  };
  participants: any[];
  currentParticipants: number;
  maxParticipants: number;
}

export default function SessionList() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Available Sessions</h2>
        <Link
          href="/sessions/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No sessions available</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Hosted by {session.host.firstName} {session.host.lastName} ({session.host.userType})
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(session.startTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {session.currentParticipants}/{session.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {session.participants.length} participants
                </div>
                <Link
                  href={`/sessions/${session.sessionId}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Join Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 