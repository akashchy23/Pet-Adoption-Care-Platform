import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdopterAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentApi.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentApi.cancelAppointment(id);
      success('Appointment cancelled.');
      fetchAppointments();
    } catch (err) {
      error('Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Veterinary Appointments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Booked clinical consultations and wellness exams.
          </p>
        </div>

        <Link to="/vets">
          <Button variant="primary" size="sm" icon={Plus}>
            Book Vet Visit
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No vet appointments scheduled"
          description="Book a consultation with our verified veterinarians."
          actionLabel="Find a Veterinarian"
          onAction={() => (window.location.href = '/vets')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
