"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function JoinSessionPage() {
  const [sessionCode, setSessionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Extract session ID from code or link
      let sessionId = sessionCode;
      if (sessionCode.includes('/')) {
        sessionId = sessionCode.split('/').pop() || sessionCode;
      }

      // Validate session exists
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (response.ok) {
        router.push(`/sessions/${sessionId}`);
      } else {
        setError("Invalid session code or link");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Session
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your session code or link
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              id="sessionCode"
              name="sessionCode"
              type="text"
              label="Session Code or Link"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="e.g. 123-456 or https://..."
              required
            />
          </div>

          <ErrorDisplay error={error} />

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