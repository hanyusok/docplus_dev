"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { 
        method: "POST" 
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <span className="sr-only">View notifications</span>
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <li className="p-4 text-gray-500 text-center">Loading...</li>
            ) : notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-center">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    n.isRead ? "" : "bg-blue-50"
                  }`}
                  onClick={() => {
                    if (!n.isRead) markAsRead(n.id);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-medium ${n.isUrgent ? "text-red-600" : "text-gray-900"}`}>
                      {n.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                  {!n.isRead && (
                    <span className="inline-block mt-2 text-xs text-blue-600">
                      Click to mark as read
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 