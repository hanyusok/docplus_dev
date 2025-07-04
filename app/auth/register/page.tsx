"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { validateRegistrationForm, RegistrationFormData } from "@/components/auth/FormValidation";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userType: "patient",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setError(validation.error || "Validation failed");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        // Redirect to login page with success message
        router.push("/auth/login?message=Registration successful! Please sign in with your new account.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "admin", label: "Administrator" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our telemedicine platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />

            <FormSelect
              id="userType"
              name="userType"
              label="Account Type"
              value={formData.userType}
              onChange={handleChange}
              options={userTypeOptions}
              required
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              showPasswordToggle
            />
            
            <PasswordStrengthIndicator password={formData.password} />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              showPasswordToggle
            />

            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="mt-1 flex items-center text-green-600">
                <CheckIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">Passwords match</span>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <ErrorDisplay error={error} />

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 