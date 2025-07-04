"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (session.user.userType !== "patient") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session.user.name}</span>
              <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Upcoming Sessions</h2>
            <p className="text-gray-600">Join group sessions or book new appointments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/sessions/join" className="bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center">Join Group Session</Link>
            <Link href="/appointments" className="bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center">View Appointments</Link>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between items-center"><span>Cardiology Group</span><span className="text-xs text-gray-500">Attended</span></li>
              <li className="py-2 flex justify-between items-center"><span>Diabetes Support</span><span className="text-xs text-gray-500">Upcoming</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 