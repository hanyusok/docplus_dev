"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  emergencyContact?: any;
  insuranceInfo?: any;
  isActive: boolean;
  createdAt: string;
}

interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  sessionType: string;
  notes?: string;
}

interface MedicalRecord {
  id: string;
  title: string;
  recordType: string;
  description?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  createdAt: string;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  isActive: boolean;
  prescribedAt: string;
  expiresAt?: string;
}

export default function PatientProfile() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'prescriptions'>('overview');

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      const [patientRes, appointmentsRes, recordsRes, prescriptionsRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/appointments?patientId=${patientId}`),
        fetch(`/api/patients/${patientId}/records`),
        fetch(`/api/patients/${patientId}/prescriptions`),
      ]);

      if (patientRes.ok) setPatient(await patientRes.json());
      if (appointmentsRes.ok) setAppointments(await appointmentsRes.json());
      if (recordsRes.ok) setMedicalRecords(await recordsRes.json());
      if (prescriptionsRes.ok) setPrescriptions(await prescriptionsRes.json());
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading patient profile...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient not found</p>
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
              href={`/patients/${patientId}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              href={`/appointments/new?patientId=${patientId}`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Schedule Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'records', label: 'Medical Records' },
              { id: 'prescriptions', label: 'Prescriptions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
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

              {/* Quick Stats */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
                    <div className="text-sm text-blue-600">Total Appointments</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{medicalRecords.length}</div>
                    <div className="text-sm text-green-600">Medical Records</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{prescriptions.filter(p => p.isActive).length}</div>
                    <div className="text-sm text-purple-600">Active Prescriptions</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
                <Link
                  href={`/appointments/new?patientId=${patientId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule New
                </Link>
              </div>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(appointment.startTime)} - {formatDateTime(appointment.endTime)}
                        </p>
                        <p className="text-sm text-gray-600">Type: {appointment.sessionType}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No appointments found</p>
                )}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
                <Link
                  href={`/patients/${patientId}/records/new`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Record
                </Link>
              </div>
              <div className="space-y-3">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.title}</h4>
                        <p className="text-sm text-gray-600">Type: {record.recordType}</p>
                        <p className="text-sm text-gray-600">Date: {formatDate(record.createdAt)}</p>
                        {record.description && (
                          <p className="text-sm text-gray-700 mt-2">{record.description}</p>
                        )}
                      </div>
                      <Link
                        href={`/patients/${patientId}/records/${record.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                {medicalRecords.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No medical records found</p>
                )}
              </div>
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Prescriptions</h3>
                <Link
                  href={`/patients/${patientId}/prescriptions/new`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Prescription
                </Link>
              </div>
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{prescription.medicationName}</h4>
                        <p className="text-sm text-gray-600">
                          {prescription.dosage} - {prescription.frequency} for {prescription.duration}
                        </p>
                        <p className="text-sm text-gray-600">Prescribed: {formatDate(prescription.prescribedAt)}</p>
                        {prescription.instructions && (
                          <p className="text-sm text-gray-700 mt-2">{prescription.instructions}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          prescription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prescription.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Link
                          href={`/patients/${patientId}/prescriptions/${prescription.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {prescriptions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No prescriptions found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 