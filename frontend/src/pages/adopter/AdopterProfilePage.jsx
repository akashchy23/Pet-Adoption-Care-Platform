import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';

export const AdopterProfilePage = () => {
  const { user, role, updateProfile } = useAuth();
  const { success } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 234-5678',
    address: user?.address || '42 Pine Hill Lane, Seattle, WA',
    bio: user?.bio || 'Outdoor enthusiast looking for a canine companion for hiking.'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile(profileData);
    setTimeout(() => {
      setIsSaving(false);
      success('Profile updated successfully!');
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          Profile & Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal information and contact preferences.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
        {/* Avatar header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">{user?.name}</h3>
            <p className="text-xs font-semibold text-teal-700">{ROLE_LABELS[role] || role}</p>
            <span className="text-[11px] text-slate-400">Member since {user?.joinedDate || '2025'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              icon={User}
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={profileData.email}
              disabled
              helperText="Managed by account security"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              icon={Phone}
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
            <Input
              label="Address / Region"
              icon={MapPin}
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Personal Bio / Adoption Motivation
            </label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={isSaving}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
