import React from 'react';
import { Search, HeartHandshake, Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are currently no items matching your criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-slate-50/70 border-2 border-dashed border-slate-200 ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4 shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 font-heading">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
