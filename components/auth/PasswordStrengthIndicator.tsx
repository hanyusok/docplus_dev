import React from "react";
import { getPasswordStrength } from "./FormValidation";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthIndicator({ 
  password, 
  className = "" 
}: PasswordStrengthIndicatorProps) {
  const passwordStrength = getPasswordStrength(password);

  if (password.length === 0) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex space-x-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded ${
              level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">{passwordStrength.text}</p>
    </div>
  );
} 