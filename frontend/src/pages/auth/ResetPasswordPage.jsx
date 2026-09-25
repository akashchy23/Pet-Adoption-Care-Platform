import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Mail, Lock, User, Phone, UserPlus, Stethoscope, Building2 } from 'lucide-react';
import { USER_ROLES, VET_SPECIALIZATIONS } from '../../utils/constants';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.ADOPTER,
    clinicName: '',
    specialization: 'Small Animal Wellness & Surgery',
    consultationFee: '75',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      success('Account registered successfully! Welcome to PetHaven.');
      navigate('/');
    } else {
      error(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Join PetHaven to adopt pets, manage shelter animals, or book appointments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          name="name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Alex Morgan"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="alex@example.com"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            name="phone"
            icon={Phone}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />

          <Select
            label="I am joining as a"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { label: 'Pet Adopter', value: USER_ROLES.ADOPTER },
              { label: 'Pet Owner', value: USER_ROLES.PET_OWNER },
              { label: 'Veterinarian (Doctor)', value: USER_ROLES.VETERINARIAN },
              { label: 'Admin', value: USER_ROLES.ADMINISTRATOR }
            ]}
          />
        </div>

        {formData.role === USER_ROLES.VETERINARIAN && (
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-teal-900">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Veterinarian Practice Details (Visible to Adopters)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Clinic / Hospital Name"
                name="clinicName"
                icon={Building2}
                value={formData.clinicName}
                onChange={handleChange}
                placeholder="e.g. Greenwood Animal Hospital"
              />
              <Select
                label="Primary Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                options={VET_SPECIALIZATIONS.filter((s) => s !== 'All Specializations')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Consultation Fee ($)"
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="75"
              />
              <Input
                label="Short Bio / Experience"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="WSU DVM, 8+ years small animal care"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            name="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={UserPlus}
            isLoading={loading}
            className="w-full shadow-md shadow-teal-600/20"
          >
            Register Account
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-teal-700 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
