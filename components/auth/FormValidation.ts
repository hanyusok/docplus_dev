export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userType: string;
  agreeToTerms?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export const validateRegistrationForm = (formData: RegistrationFormData): ValidationResult => {
  // Check required fields
  if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
    return { isValid: false, error: "All fields are required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  // Validate password match
  if (formData.password !== formData.confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  // Validate password strength
  if (formData.password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }

  // Validate terms agreement (if required)
  if (formData.agreeToTerms !== undefined && !formData.agreeToTerms) {
    return { isValid: false, error: "You must agree to the terms and conditions" };
  }

  return { isValid: true };
};

export const validateLoginForm = (formData: LoginFormData): ValidationResult => {
  if (!formData.email || !formData.password) {
    return { isValid: false, error: "Email and password are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, color: "bg-gray-200", text: "" };
  if (password.length < 8) return { strength: 1, color: "bg-red-500", text: "Weak" };
  if (password.length < 12) return { strength: 2, color: "bg-yellow-500", text: "Fair" };
  return { strength: 3, color: "bg-green-500", text: "Strong" };
}; 