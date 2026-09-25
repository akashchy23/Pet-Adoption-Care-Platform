import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4'
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200/80',
        variantClasses[variant],
        className
      )}
    />
  );
};

export const PetCardSkeleton = () => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col space-y-4">
      <Skeleton className="w-full h-52 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="w-full h-4" />
        </td>
      ))}
    </tr>
  );
};
