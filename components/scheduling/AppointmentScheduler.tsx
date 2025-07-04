"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { formatTime } from "@/lib/utils";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

interface AppointmentForm {
  title: string;
  description: string;
  sessionType: 'individual' | 'group' | 'consultation' | 'therapy' | 'follow_up';
  duration: number;
  allowRecording: boolean;
  allowScreenSharing: boolean;
  allowChat: boolean;
  waitingRoomEnabled: boolean;
  notes: string;
}

export default function AppointmentScheduler() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentForm>({
    title: '',
    description: '',
    sessionType: 'individual',
    duration: 30,
    allowRecording: false,
    allowScreenSharing: true,
    allowChat: true,
    waitingRoomEnabled: true,
    notes: '',
  });

  useEffect(() => {
    if (session?.user) {
      loadAvailableSlots();
    }
  }, [session, selectedDate]);

  const loadAvailableSlots = async () => {
    if (!session?.user) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/schedule/slots?providerId=${session.user.id}&date=${dateStr}`);
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleFormChange = (field: keyof AppointmentForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot || !session?.user) return;

    setIsLoading(true);
    try {
      const appointmentData = {
        ...formData,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        providerId: session.user.id,
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const appointment = await response.json();
        alert('Appointment scheduled successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          sessionType: 'individual',
          duration: 30,
          allowRecording: false,
          allowScreenSharing: true,
          allowChat: true,
          waitingRoomEnabled: true,
          notes: '',
        });
        setSelectedTimeSlot(null);
        loadAvailableSlots();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Error scheduling appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekDays = (): Date[] => {
    const days: Date[] = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const sessionTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "group", label: "Group" },
    { value: "consultation", label: "Consultation" },
    { value: "therapy", label: "Therapy" },
    { value: "follow_up", label: "Follow-up" },
  ];

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Schedule Appointment</h2>
          <p className="text-gray-600 mt-1">Select a date and time for your appointment</p>
        </div>

        <div className="p-6">
          {/* Calendar */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {getWeekDays().map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateChange(date)}
                  className={`p-3 text-center rounded-lg transition-colors ${
                    isSelected(date)
                      ? 'bg-blue-600 text-white'
                      : isToday(date)
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">{date.getDate()}</div>
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString([], { month: 'short' })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {availableSlots.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-4">
                  No available slots for this date
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      selectedTimeSlot?.id === slot.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium">{formatTime(slot.startTime)}</div>
                    <div className="text-xs opacity-75">
                      {formatTime(slot.endTime)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Appointment Form */}
          {selectedTimeSlot && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="title"
                  name="title"
                  type="text"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Appointment title"
                  required
                />

                <FormSelect
                  id="sessionType"
                  name="sessionType"
                  label="Session Type"
                  value={formData.sessionType}
                  onChange={(e) => handleFormChange('sessionType', e.target.value)}
                  options={sessionTypeOptions}
                />

                <FormSelect
                  id="duration"
                  name="duration"
                  label="Duration (minutes)"
                  value={formData.duration.toString()}
                  onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                  options={durationOptions}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Session Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Session Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowRecording}
                      onChange={(e) => handleFormChange('allowRecording', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Allow Recording</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowScreenSharing}
                      onChange={(e) => handleFormChange('allowScreenSharing', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Allow Screen Sharing</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowChat}
                      onChange={(e) => handleFormChange('allowChat', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Allow Chat</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.waitingRoomEnabled}
                      onChange={(e) => handleFormChange('waitingRoomEnabled', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable Waiting Room</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes or special requirements..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedTimeSlot(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 