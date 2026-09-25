import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { appointmentApi } from '../../api/appointmentApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const VetBookingModal = ({ isOpen, onClose, vet, onSuccess }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [bookingData, setBookingData] = useState({
    petName: 'Luna',
    petSpecies: 'Dog',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time: vet?.timeSlots?.[0] || '10:00 AM',
    reason: 'Annual Wellness & Preventive Checkup',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vet) return;

    setIsSubmitting(true);
    try {
      await appointmentApi.bookAppointment({
        vetId: vet.id,
        vetName: vet.name,
        vetEmail: vet.email || '',
        clinicName: vet.clinicName || '',
        fee: vet.consultationFee || 75,
        ownerId: user?.id || 'user-1',
        ownerName: user?.name || 'Alex Morgan',
        ownerEmail: user?.email || '',
        ...bookingData
      });
      success(`Consultation with ${vet.name} scheduled for ${bookingData.date} at ${bookingData.time}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vet) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book Appointment with ${vet.name}`}
      subtitle={`${vet.clinicName} • Consultation Fee: ${formatCurrency(vet.consultationFee)}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center gap-3">
          <img
            src={vet.avatar}
            alt={vet.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-bold text-slate-900 text-sm">{vet.name}</p>
            <p className="text-xs text-teal-800">{vet.specialization}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Pet Name"
            value={bookingData.petName}
            onChange={(e) => setBookingData({ ...bookingData, petName: e.target.value })}
            placeholder="e.g. Luna"
            required
          />
          <Select
            label="Pet Species"
            value={bookingData.petSpecies}
            onChange={(e) => setBookingData({ ...bookingData, petSpecies: e.target.value })}
            options={['Dog', 'Cat', 'Rabbit', 'Bird', 'Other']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Preferred Date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={bookingData.date}
            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
            required
          />
          <Select
            label="Time Slot"
            value={bookingData.time}
            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
            options={vet.timeSlots || ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']}
          />
        </div>

        <Select
          label="Reason for Visit"
          value={bookingData.reason}
          onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
          options={[
            'Annual Wellness & Preventive Checkup',
            'Vaccination Booster',
            'Dental Examination / Cleaning',
            'Skin Allergy / Ear Check',
            'Post-Surgery Review',
            'General Illness / Symptoms'
          ]}
        />

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Notes / Symptoms (Optional)
          </label>
          <textarea
            rows={2}
            value={bookingData.notes}
            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
            placeholder="Describe any symptoms, previous medications, or questions for the doctor..."
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Calendar}
            isLoading={isSubmitting}
          >
            Confirm Appointment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
