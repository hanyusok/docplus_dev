"use client";

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface VideoConferenceProps {
  sessionId: string;
  onLeave: () => void;
}

interface Message {
  id: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  userType: string;
  isMuted: boolean;
  isScreenSharing: boolean;
}

export default function VideoConference({ sessionId, onLeave }: VideoConferenceProps) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Initialize Socket.IO connection
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001', {
      path: '/api/socketio',
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Socket.IO');
      
      // Join the session
      newSocket.emit('join-session', {
        sessionId,
        userId: session.user.id,
        userType: session.user.userType,
      });
    });

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data);
      setParticipants(prev => [...prev, {
        id: data.userId,
        name: data.userName || 'Unknown',
        userType: data.userType,
        isMuted: false,
        isScreenSharing: false,
      }]);
    });

    newSocket.on('user-left', (data) => {
      console.log('User left:', data);
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
    });

    newSocket.on('offer', async (data) => {
      await handleOffer(data.offer, data.from);
    });

    newSocket.on('answer', async (data) => {
      await handleAnswer(data.answer, data.from);
    });

    newSocket.on('ice-candidate', async (data) => {
      await handleIceCandidate(data.candidate, data.from);
    });

    setSocket(newSocket);

    // Initialize WebRTC
    initializeWebRTC();

    return () => {
      newSocket.disconnect();
    };
  }, [session, sessionId]);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeerConnection = (userId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    // Add local stream tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream.current!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          to: userId,
          candidate: event.candidate,
          from: session?.user?.id,
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnections.current[userId] = peerConnection;
    return peerConnection;
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit, from: string) => {
    const peerConnection = createPeerConnection(from);
    await peerConnection.setRemoteDescription(offer);
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (socket) {
      socket.emit('answer', {
        to: from,
        answer,
        from: session?.user?.id,
      });
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit, from: string) => {
    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit, from: string) => {
    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-message', {
      sessionId,
      message: newMessage,
      userId: session?.user?.id,
      userName: session?.user?.name,
    });

    setNewMessage('');
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        
        screenStream.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(true);
        if (socket) {
          socket.emit('screen-share-start', { sessionId, userId: session?.user?.id });
        }
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (screenStream.current) {
        screenStream.current.getTracks().forEach(track => track.stop());
        screenStream.current = null;
      }
      
      if (localStream.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
      
      setIsScreenSharing(false);
      if (socket) {
        socket.emit('screen-share-stop', { sessionId, userId: session?.user?.id });
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (socket) {
      if (!isRecording) {
        socket.emit('start-recording', { sessionId, userId: session?.user?.id });
      } else {
        socket.emit('stop-recording', { sessionId, userId: session?.user?.id });
      }
    }
  };

  const leaveSession = () => {
    if (socket) {
      socket.emit('leave-session', { sessionId, userId: session?.user?.id });
    }
    
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => track.stop());
    }
    
    onLeave();
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Video Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-600'} text-white`}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-600' : 'bg-gray-600'} text-white`}
            >
              {isVideoEnabled ? '📹' : '🚫'}
            </button>
            
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
            >
              🖥️
            </button>
            
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-gray-600'} text-white`}
            >
              {isRecording ? '⏹️' : '🔴'}
            </button>
            
            <button
              onClick={leaveSession}
              className="p-3 rounded-full bg-red-600 text-white"
            >
              📞
            </button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-white flex flex-col">
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
    </div>
  );
} 