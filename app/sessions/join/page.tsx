"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinSessionPage() {
  const [sessionCode, setSessionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // TODO: Validate and join session
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/sessions/${sessionCode}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join Group Session
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your session code or link to join
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700">
                Session Code or Link
              </label>
              <input
                id="sessionCode"
                name="sessionCode"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g. 123-456 or https://..."
                value={sessionCode}
                onChange={e => setSessionCode(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-sm">{error}</div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Joining..." : "Join Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 