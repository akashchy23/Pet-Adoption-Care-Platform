import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load content from the server. Please check your connection or retry.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-rose-50/60 border border-rose-100 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900">{title}</h3>
      <p className="mt-1 text-xs text-rose-600 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
