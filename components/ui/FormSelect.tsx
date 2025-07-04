import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  error,
  disabled = false,
  placeholder,
}: FormSelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 