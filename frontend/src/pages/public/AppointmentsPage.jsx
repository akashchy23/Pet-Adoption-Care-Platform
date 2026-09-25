import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { TabView } from '../../components/common/TabView';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '10:00 AM' });
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
      success('Appointment has been cancelled.');
      fetchAppointments();
    } catch (err) {
      error('Failed to cancel appointment.');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!reschedulingApt) return;
    try {
      await appointmentApi.rescheduleAppointment(
        reschedulingApt.id,
        rescheduleData.date,
        rescheduleData.time
      );
      success(`Appointment rescheduled to ${rescheduleData.date} at ${rescheduleData.time}!`);
      setReschedulingApt(null);
      fetchAppointments();
    } catch (err) {
      error('Failed to reschedule.');
    }
  };

  const upcomingList = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const pastList = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const displayedList = activeTab === 'upcoming' ? upcomingList : pastList;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
            Veterinary Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
            My Veterinary Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Manage upcoming consultations, review past clinical visit summaries, and reschedule times.
          </p>
        </div>

        <Link to="/vets">
          <Button variant="primary" size="md" icon={Plus}>
            Book New Appointment
          </Button>
        </Link>
      </div>

      <TabView
        tabs={[
          { id: 'upcoming', label: 'Upcoming Appointments', count: upcomingList.length },
          { id: 'past', label: 'Past & Completed', count: pastList.length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading appointments...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments logged'}
          description="Schedule a consultation with our certified veterinarians anytime."
          actionLabel="Find a Vet"
          onAction={() => (window.location.href = '/vets')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedList.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={handleCancel}
              onReschedule={(a) => {
                setReschedulingApt(a);
                setRescheduleData({ date: a.date, time: a.time });
              }}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <Modal
          isOpen={!!reschedulingApt}
          onClose={() => setReschedulingApt(null)}
          title={`Reschedule Visit with ${reschedulingApt.vetName}`}
          subtitle={`Pet: ${reschedulingApt.petName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-left">
            <Input
              label="Select New Date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={rescheduleData.date}
              onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              required
            />
            <Select
              label="Select Time Slot"
              value={rescheduleData.time}
              onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
              options={['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']}
            />
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => setReschedulingApt(null)} type="button">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

