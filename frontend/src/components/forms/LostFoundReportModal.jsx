import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { lostFoundApi } from '../../api/lostFoundApi';
import { useToast } from '../../context/ToastContext';
import { MapPin, Send } from 'lucide-react';

export const LostFoundReportModal = ({ isOpen, onClose, initialType = 'Lost', onSuccess }) => {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    type: initialType,
    petName: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    color: '',
    lastSeenLocation: '',
    reward: '',
    contactName: '',
    contactPhone: '',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await lostFoundApi.createReport(formData);
      success(`${formData.type === 'Lost' ? 'Lost pet alert' : 'Found pet report'} submitted successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.type === 'Lost' ? 'Report a Lost Pet' : 'Report a Found Pet'}
      subtitle="Help reunite missing pets with their families across the community"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Report Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={['Lost', 'Found']}
          />
          <Input
            label="Pet Name (or 'Unknown')"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder="e.g. Buster"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            options={['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']}
          />
          <Input
            label="Breed / Mix"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g. Beagle"
            required
          />
          <Input
            label="Color & Markings"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Tricolor"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Last Seen Area / Location"
            name="lastSeenLocation"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            placeholder="e.g. Green Lake Park, Seattle"
            required
          />
          <Input
            label="Reward Offered (Optional)"
            name="reward"
            value={formData.reward}
            onChange={handleChange}
            placeholder="e.g. $200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Your Contact Name"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
          <Input
            label="Your Phone Number"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <Input
          label="Photo Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
          required
        />

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Description & Key Identifying Details
          </label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe collar color, microchip info, behavior around strangers, or medical conditions..."
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            required
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            variant={formData.type === 'Lost' ? 'danger' : 'primary'}
            size="md"
            icon={Send}
            isLoading={isSubmitting}
          >
            Post {formData.type} Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
