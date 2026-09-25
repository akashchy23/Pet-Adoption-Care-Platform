import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-3xl font-heading mb-4">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
