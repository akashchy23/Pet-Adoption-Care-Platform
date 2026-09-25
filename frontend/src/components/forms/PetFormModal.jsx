import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { petApi } from '../../api/petApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PawPrint, Save, Upload } from 'lucide-react';

export const PetFormModal = ({ isOpen, onClose, pet = null, onSuccess }) => {
  const isEditing = !!pet;
  const { user, role } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '1 year',
    ageMonths: 12,
    gender: 'Female',
    size: 'Medium',
    weightKg: 15,
    adoptionFee: 150,
    status: 'Available',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    primaryImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    description: '',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        age: pet.age || '1 year',
        ageMonths: pet.ageMonths || 12,
        gender: pet.gender || 'Female',
        size: pet.size || 'Medium',
        weightKg: pet.weightKg || 15,
        adoptionFee: pet.adoptionFee || 150,
        status: pet.status || 'Available',
        vaccinated: pet.vaccinated ?? true,
        vaccinationStatus: pet.vaccinationStatus || 'Up to date',
        healthStatus: pet.healthStatus || 'Excellent',
        primaryImage: pet.primaryImage || '',
        description: pet.description || '',
        shelterName: pet.shelterName || 'Happy Paws Rescue',
        shelterLocation: pet.shelterLocation || 'Seattle, WA'
      });
    } else {
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        age: '1 year',
        ageMonths: 12,
        gender: 'Female',
        size: 'Medium',
        weightKg: 15,
        adoptionFee: 150,
        status: 'Available',
        vaccinated: true,
        vaccinationStatus: 'Up to date',
        healthStatus: 'Excellent',
        primaryImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
        description: '',
        shelterName: 'Happy Paws Rescue',
        shelterLocation: 'Seattle, WA'
      });
    }
  }, [pet, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        ownerId: user?.id || formData.ownerId,
        ownerEmail: user?.email || formData.ownerEmail,
        ownerName: user?.name || formData.ownerName
      };

      if (isEditing) {
        await petApi.updatePet(pet.id, payload);
        success(`Pet profile for ${formData.name} updated successfully!`);
      } else {
        await petApi.createPet(payload);
        success(role === 'PetOwner' 
          ? `Companion pet ${formData.name} registered into database!` 
          : `New pet ${formData.name} added to sanctuary inventory!`);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save pet details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isEditing 
    ? `Edit Pet: ${pet?.name}` 
    : (role === 'PetOwner' ? 'Register New Pet Companion' : 'Add New Intake Pet');
  const modalSubtitle = role === 'PetOwner'
    ? 'Create digital passport, microchip profile, and vaccination records in database'
    : 'Complete sanctuary profile, vaccination batch status, and adoption fee';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Pet Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Copper"
            required
          />
          <Input
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g. Golden Retriever"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            options={['Dog', 'Cat', 'Rabbit', 'Bird', 'Other']}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={['Male', 'Female']}
          />
          <Select
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            options={['Small', 'Medium', 'Large']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Age Display (e.g. 2 yrs)"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <Input
            label="Adoption Fee ($)"
            type="number"
            name="adoptionFee"
            value={formData.adoptionFee}
            onChange={handleChange}
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Available', 'Pending', 'Adopted']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Primary Photo URL"
            name="primaryImage"
            value={formData.primaryImage}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
          <Select
            label="Vaccination Status"
            name="vaccinationStatus"
            value={formData.vaccinationStatus}
            onChange={handleChange}
            options={['Up to date', 'Booster Needed', 'In Progress']}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Pet Description & Temperament
          </label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the pet's personality, behavior with other animals/kids, and history..."
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
            variant="primary"
            size="md"
            icon={Save}
            isLoading={isSubmitting}
          >
            {isEditing ? 'Update Pet' : 'Publish Pet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
