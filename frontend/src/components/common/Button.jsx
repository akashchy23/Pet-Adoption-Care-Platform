import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow shadow-teal-600/20 focus:ring-teal-500',
    secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow shadow-emerald-600/20 focus:ring-emerald-500',
    amber: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm hover:shadow shadow-amber-500/20 focus:ring-amber-500',
    outline: 'border-2 border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 text-slate-700 hover:text-teal-700 focus:ring-teal-500 bg-white',
    ghost: 'text-slate-600 hover:text-teal-700 hover:bg-teal-50/60 focus:ring-teal-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-700'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
};
