import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    const res = await login(formData);
    setLoading(false);

    if (res.success) {
      success('Logged in successfully! Welcome back to PetHaven.');
      navigate('/');
    } else {
      error(res.message || 'Invalid email or password credentials');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to access your PetHaven account, manage pet listings, or book appointments.
        </p>
      </div>

      {/* Standard Login Form */}
      <form onSubmit={handleCustomLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
          placeholder="your.email@example.com"
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={LogIn}
          isLoading={loading}
          className="w-full shadow-md shadow-teal-600/20"
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don’t have an account yet?{' '}
        <Link to="/register" className="font-bold text-teal-700 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};
