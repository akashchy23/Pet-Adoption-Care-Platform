import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { authApi } from '../../api/authApi';
import { useToast } from '../../context/ToastContext';
import { USER_ROLES } from '../../utils/constants';
import { User, Save } from 'lucide-react';

export const UserFormModal = ({ isOpen, onClose, user = null, onSuccess }) => {
  const isEditing = !!user;
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: USER_ROLES.ADOPTER,
    phone: '',
    address: '',
    city: '',
    avatar: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || USER_ROLES.ADOPTER,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        avatar: user.avatar || user.profileImage || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: USER_ROLES.ADOPTER,
        phone: '',
        address: '',
        city: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await authApi.updateUser(user.id, formData);
        success(`User ${formData.name} updated successfully!`);
      } else {
        await authApi.createUser(formData);
        success(`User account for ${formData.name} created!`);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit User: ${user?.name}` : 'Create New User Account'}
      subtitle="Manage permissions, user profile, and system roles"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Eleanor Vance"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
        />

        <Select
          label="Assigned System Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { label: 'Pet Adopter', value: USER_ROLES.ADOPTER },
            { label: 'Pet Owner', value: USER_ROLES.PET_OWNER },
            { label: 'Veterinarian', value: USER_ROLES.VETERINARIAN },
            { label: 'Administrator', value: USER_ROLES.ADMINISTRATOR }
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="City / Location"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Seattle, WA"
          />
        </div>

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Pine St"
        />

        <Input
          label="Avatar URL (optional)"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="https://..."
        />

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
            {isEditing ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
