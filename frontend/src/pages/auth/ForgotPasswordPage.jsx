import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Mail, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      success(`Password reset instructions sent to ${email}`);
      setSubmitted(true);
    } catch (err) {
      error('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">
          Reset Password
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email and we'll send a secure password reset link.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Check your inbox</h4>
          <p className="text-xs text-slate-600">
            We've dispatched a reset link to <span className="font-bold">{email}</span>. Click the link to update your credentials.
          </p>
          <div className="pt-2">
            <Link to="/reset-password">
              <Button variant="primary" size="sm" className="w-full">
                Simulate Reset Token Link
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            isLoading={loading}
            className="w-full shadow-md shadow-teal-600/20"
          >
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-slate-100">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
