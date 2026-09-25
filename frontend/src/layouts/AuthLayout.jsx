import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white sm:bg-slate-50 text-slate-900 relative p-4 sm:p-6">
      {/* Header Brand */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto relative z-10 py-2">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-600/20">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5 10.67 15 11.5 15s1.5.67 1.5 1.5zm-3-4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm6 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-8-3c0-.83.67-1.5 1.5-1.5S9.5 8.67 9.5 9.5 8.83 11 8 11s-1.5-.67-1.5-1.5zm10 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
            Pet<span className="text-teal-600">Haven</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs"
        >
          Return to Home
        </Link>
      </header>

      {/* Auth Card Container */}
      <div className="my-auto py-6 sm:py-8 flex justify-center relative z-10">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-2 relative z-10">
        <p>© {new Date().getFullYear()} PetHaven Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
