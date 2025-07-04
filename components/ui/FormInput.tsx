import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormInputProps {
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "number" | "date" | "datetime-local";
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  showPasswordToggle?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function FormInput({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = "",
  showPasswordToggle = false,
  error,
  disabled = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          required={required}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            showPasswordToggle ? "pr-10" : ""
          } ${
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 