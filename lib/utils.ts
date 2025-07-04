import React from "react";

// Date and time formatting utilities
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Status color utilities
export const getStatusColor = (isActive: boolean): string => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};



// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred. Please try again.';
};

 