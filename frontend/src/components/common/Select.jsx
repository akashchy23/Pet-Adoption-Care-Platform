import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={clsx(
              'w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-teal-100',
              className
            )}
            {...props}
          >
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
