"use client";

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface WaitingRoomProps {
  sessionId: string;
  onAdmitted: () => void;
  onLeave: () => void;
}

interface WaitingParticipant {
  id: string;
  name: string;
  userType: string;
  joinTime: string;
  estimatedWait: number;
  priority: number;
  status: 'waiting' | 'admitted' | 'left' | 'removed';
}

interface Message {
  id: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export default function WaitingRoom({ sessionId, onAdmitted, onLeave }: WaitingRoomProps) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<WaitingParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [waitingRoomInfo, setWaitingRoomInfo] = useState({
    currentQueue: 0,
    estimatedWaitTime: 0,
    customMessage: '',
    allowChat: true,
    allowVideo: false,
    allowAudio: false,
  });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user) return;

    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001', {
      path: '/api/socketio',
    });

    newSocket.on('connect', () => {
      console.log('Connected to waiting room');
      
      // Join waiting room
      newSocket.emit('join-waiting-room', {
        sessionId,
        userId: session.user.id,
        userType: session.user.userType,
        userName: session.user.name,
      });
    });

    newSocket.on('waiting-room-joined', (data) => {
      setParticipants(data.participants || []);
      setWaitingRoomInfo(data.waitingRoomInfo || {});
      setIsHost(data.isHost || false);
    });

    newSocket.on('participant-joined-waiting', (data) => {
      setParticipants(prev => [...prev, data]);
    });

    newSocket.on('participant-left-waiting', (data) => {
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
    });

    newSocket.on('participant-admitted', (data) => {
      if (data.userId === session.user.id) {
        onAdmitted();
      } else {
        setParticipants(prev => prev.filter(p => p.id !== data.userId));
      }
    });

    newSocket.on('waiting-room-message', (message) => {
      setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
    });

    newSocket.on('waiting-room-updated', (data) => {
      setWaitingRoomInfo(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session, sessionId, onAdmitted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-waiting-room-message', {
      sessionId,
      message: newMessage,
      userId: session?.user?.id,
      userName: session?.user?.name,
    });

    setNewMessage('');
  };

  const admitParticipant = (userId: string) => {
    if (!socket || !isHost) return;

    socket.emit('admit-participant', {
      sessionId,
      userId,
      admittedBy: session?.user?.id,
    });
  };

  const removeParticipant = (userId: string) => {
    if (!socket || !isHost) return;

    socket.emit('remove-participant', {
      sessionId,
      userId,
      removedBy: session?.user?.id,
    });
  };

  const toggleVideo = async () => {
    if (!isVideoEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsVideoEnabled(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      setIsVideoEnabled(false);
    }
  };

  const toggleAudio = async () => {
    if (!isAudioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsAudioEnabled(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      setIsAudioEnabled(false);
    }
  };

  const leaveWaitingRoom = () => {
    if (socket) {
      socket.emit('leave-waiting-room', {
        sessionId,
        userId: session?.user?.id,
      });
    }
    onLeave();
  };

  const getPositionInQueue = () => {
    const userParticipant = participants.find(p => p.id === session?.user?.id);
    return userParticipant ? participants.indexOf(userParticipant) + 1 : 0;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Waiting Room */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Waiting Room</h1>
              <p className="text-sm text-gray-600">
                Session: {sessionId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Position in queue: {getPositionInQueue()}
              </div>
              <div className="text-sm text-gray-600">
                Estimated wait: {waitingRoomInfo.estimatedWaitTime} minutes
              </div>
              <button
                onClick={leaveWaitingRoom}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {isHost ? 'Waiting Room Management' : 'Waiting for Admission'}
              </h2>

              {waitingRoomInfo.customMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <p className="text-blue-800">{waitingRoomInfo.customMessage}</p>
                </div>
              )}

              {/* Video Preview */}
              {isVideoEnabled && (
                <div className="mb-6">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-w-md rounded-lg"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex space-x-4 mb-6">
                {waitingRoomInfo.allowVideo && (
                  <button
                    onClick={toggleVideo}
                    className={`px-4 py-2 rounded-md ${
                      isVideoEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isVideoEnabled ? '📹 Camera On' : '📹 Camera Off'}
                  </button>
                )}
                
                {waitingRoomInfo.allowAudio && (
                  <button
                    onClick={toggleAudio}
                    className={`px-4 py-2 rounded-md ${
                      isAudioEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isAudioEnabled ? '🎤 Mic On' : '🎤 Mic Off'}
                  </button>
                )}
              </div>

              {/* Queue (for hosts) */}
              {isHost && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Queue</h3>
                  <div className="space-y-2">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="flex justify-between items-center bg-white p-3 rounded-md border"
                      >
                        <div>
                          <span className="font-medium">{participant.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({participant.userType})
                          </span>
                          <div className="text-xs text-gray-400">
                            Joined: {new Date(participant.joinTime).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => admitParticipant(participant.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Admit
                          </button>
                          <button
                            onClick={() => removeParticipant(participant.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          {waitingRoomInfo.allowChat && (
            <div className="w-80 bg-white border-l flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Chat</h3>
                <p className="text-sm text-gray-600">
                  {participants.length} participants
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-100 p-2 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{message.userName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 