import React from 'react';
import clsx from 'clsx';
import { getStatusBadgeClass } from '../../utils/formatters';

export const Badge = ({ children, status, variant, className = '', size = 'md' }) => {
  const customClass = status ? getStatusBadgeClass(status) : '';

  const variantClasses = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border',
        sizeClasses[size],
        customClass || variantClasses[variant] || variantClasses.slate,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {children || status}
    </span>
  );
};
