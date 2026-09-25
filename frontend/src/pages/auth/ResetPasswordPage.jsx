import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorText('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorText('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ password });
      success('Password successfully reset! Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">
          Set New Password
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Create a secure password with at least 6 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorText('');
          }}
          placeholder="••••••••"
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorText('');
          }}
          placeholder="••••••••"
          required
        />

        {errorText && <p className="text-xs font-semibold text-rose-600">{errorText}</p>}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          className="w-full shadow-md shadow-teal-600/20"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
};
