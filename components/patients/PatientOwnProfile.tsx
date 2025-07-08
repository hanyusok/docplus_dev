"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  isActive: boolean;
  createdAt: string;
}

export default function PatientOwnProfile() {
  const { data: session } = useSession();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      loadPatientData();
    }
  }, [session]);

  const loadPatientData = async () => {
    try {
      const response = await fetch(`/api/patients/${session?.user.id}`);
      if (response.ok) {
        const patientData = await response.json();
        setPatient(patientData);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      setError('Error loading profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-700">
                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">{patient.email}</p>
              {patient.phoneNumber && (
                <p className="text-gray-600">{patient.phoneNumber}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/patients/${patient.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white shadow-sm border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                <p className="text-sm text-gray-900">
                  {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : 'Not provided'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Gender:</span>
                <p className="text-sm text-gray-900">{patient.gender || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Address:</span>
                <p className="text-sm text-gray-900">
                  {patient.address ? `${patient.address}, ${patient.city}, ${patient.state} ${patient.zipCode}` : 'Not provided'}
                </p>
              </div>
              {patient.country && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Country:</span>
                  <p className="text-sm text-gray-900">{patient.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Allergies:</span>
                <p className="text-sm text-gray-900">{patient.allergies || 'None reported'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Current Medications:</span>
                <p className="text-sm text-gray-900">{patient.currentMedications || 'None'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Medical History:</span>
                <p className="text-sm text-gray-900">{patient.medicalHistory || 'No history recorded'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Account Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                patient.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {patient.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Member Since:</span>
              <p className="text-sm text-gray-900">{formatDate(patient.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 