import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const OwnerAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchApts = async () => {
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
    fetchApts();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentApi.cancelAppointment(id);
      success('Appointment cancelled.');
      fetchApts();
    } catch (err) {
      error('Failed to cancel.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Clinic Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review veterinary appointments, dental checkups, and diagnostic reviews.
          </p>
        </div>

        <Link to="/vets">
          <Button variant="primary" size="sm" icon={Plus}>
            Book Appointment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((apt) => (
          <AppointmentCard
            key={apt.id}
            appointment={apt}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
};
