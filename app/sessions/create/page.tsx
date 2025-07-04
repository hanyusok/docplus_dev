"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function CreateSessionPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          startTime: form.startTime,
        }),
      });

      if (response.ok) {
        const session = await response.json();
        router.push(`/sessions/${session.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create session");
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
            Create New Session
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up a new telemedicine session
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Session Name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Cardiology Group"
              required
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the session..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <FormInput
              id="startTime"
              name="startTime"
              type="datetime-local"
              label="Start Time"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <ErrorDisplay error={error} />

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 