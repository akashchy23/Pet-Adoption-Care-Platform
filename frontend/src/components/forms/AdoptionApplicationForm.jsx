import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adoptionApi } from '../../api/adoptionApi';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Heart, Send, CheckCircle2 } from 'lucide-react';

export const AdoptionApplicationForm = ({ pet, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phone || '',
    homeType: 'House with Fenced Yard',
    ownership: 'Own',
    familyMembers: '2',
    hasChildren: 'No',
    hasOtherPets: 'No',
    petExperience: 'Previous pet parent for 5+ years',
    monthlyBudget: '$150 - $250',
    adoptionReason: '',
    agreedToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Full name is required';
    if (!formData.applicantEmail.trim()) errs.applicantEmail = 'Email is required';
    if (!formData.applicantPhone.trim()) errs.applicantPhone = 'Phone number is required';
    if (!formData.adoptionReason.trim()) errs.adoptionReason = 'Please describe your reason for adopting';
    if (!formData.agreedToTerms) errs.agreedToTerms = 'You must agree to home verification terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await adoptionApi.submitApplication({
        petId: pet.id || pet.customId,
        petName: pet.name,
        petBreed: pet.breed,
        petImage: pet.primaryImage,
        ownerId: pet.ownerId || '',
        ownerEmail: pet.ownerEmail || '',
        ownerName: pet.ownerName || pet.shelterName || '',
        applicantId: user?.id || 'user-1',
        ...formData
      });
      success(`Adoption request for ${pet.name} submitted! Admin will review your request.`);
      if (onSuccess) onSuccess();
    } catch (err) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Pet Header */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center gap-3">
        <img
          src={pet.primaryImage}
          alt={pet.name}
          className="w-14 h-14 rounded-xl object-cover"
        />
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Applying to Adopt: {pet.name}</h4>
          <p className="text-xs text-teal-800">
            {pet.breed} • {pet.age} • Adoption Fee: ${pet.adoptionFee}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Applicant Full Name"
          name="applicantName"
          value={formData.applicantName}
          onChange={handleChange}
          error={formErrors.applicantName}
          required
        />
        <Input
          label="Email Address"
          type="email"
          name="applicantEmail"
          value={formData.applicantEmail}
          onChange={handleChange}
          error={formErrors.applicantEmail}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          name="applicantPhone"
          value={formData.applicantPhone}
          onChange={handleChange}
          error={formErrors.applicantPhone}
          placeholder="+1 (555) 000-0000"
          required
        />
        <Select
          label="Living Environment"
          name="homeType"
          value={formData.homeType}
          onChange={handleChange}
          options={[
            'House with Fenced Yard',
            'House with Unfenced Yard',
            'Apartment / Flat',
            'Condo / Townhouse',
            'Farm / Rural Property'
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Home Ownership"
          name="ownership"
          value={formData.ownership}
          onChange={handleChange}
          options={['Own', 'Rent (Landlord Approved)', 'Living with Family']}
        />
        <Select
          label="Children in Household"
          name="hasChildren"
          value={formData.hasChildren}
          onChange={handleChange}
          options={['No', 'Yes (Under 6 yrs)', 'Yes (6-12 yrs)', 'Yes (13+ yrs)']}
        />
        <Select
          label="Monthly Pet Budget"
          name="monthlyBudget"
          value={formData.monthlyBudget}
          onChange={handleChange}
          options={['$100 - $150', '$150 - $250', '$250 - $400', '$400+']}
        />
      </div>

      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Previous Pet Experience <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="petExperience"
          rows={2}
          value={formData.petExperience}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          placeholder="Briefly describe your history caring for dogs, cats, or other animals..."
          required
        />
      </div>

      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Why are you adopting {pet.name}? <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="adoptionReason"
          rows={3}
          value={formData.adoptionReason}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          placeholder="Tell the shelter about your daily routine, exercise plans, and how this pet fits your life..."
          required
        />
        {formErrors.adoptionReason && (
          <p className="text-xs font-medium text-rose-600">{formErrors.adoptionReason}</p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
          <input
            type="checkbox"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span>
            I certify that all information provided is accurate, and I agree to allow the shelter team to conduct standard adoption verification and home safety checks.
          </span>
        </label>
        {formErrors.agreedToTerms && (
          <p className="text-xs font-medium text-rose-600">{formErrors.agreedToTerms}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="pt-3 flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          icon={Send}
        >
          Submit Adoption Application
        </Button>
      </div>
    </form>
  );
};
