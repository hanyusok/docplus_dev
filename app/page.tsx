"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Group Telemedicine Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Secure, scalable telemedicine solution for group consultations
        </p>
        
        {session ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Welcome back, {session.user.name}!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${session.user.userType.toLowerCase()}/dashboard`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Get started with secure telemedicine consultations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 