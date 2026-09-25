import React from 'react';
import clsx from 'clsx';

export const TabView = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={clsx('flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit', className)}>
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : undefined;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
              isActive
                ? 'bg-white text-teal-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            )}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded-full text-[11px] font-bold',
                  isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
