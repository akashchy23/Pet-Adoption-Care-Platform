import React from 'react';
import { Heart, ShieldCheck, Stethoscope, Sparkles, Building, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      <div className="text-center space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider">
          University Software Development Project
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          About PetHaven
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          An AI-powered web-based platform for pet adoption, healthcare, shelter management, veterinary services, and pet care.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">Our Mission</h3>
          <p>
            PetHaven was conceptualized as a modern full-stack solution bridging the fragmented pet care ecosystem. By uniting animal shelters, prospective adopters, pet guardians, and certified veterinary clinics into a single synchronized platform, PetHaven ensures that every rescued pet finds the right home and receives verified medical care throughout their life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
            <h4 className="font-bold text-teal-900 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              AI-Driven Compatibility
            </h4>
            <p className="text-xs text-slate-600">
              Evaluates home space, family structure, and lifestyle to recommend high-compatibility pets.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Digital Health Passport
            </h4>
            <p className="text-xs text-slate-600">
              Microchip tracking, weight charts, surgery logs, and automated vaccination booster alerts.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">Technical Architecture</h3>
          <p className="text-xs text-slate-600 mb-3">
            Designed specifically with a clean API Service Layer to interface seamlessly with an <strong>ASP.NET Core Web API (C# & MongoDB)</strong> using JWT Authentication and Role-Based Authorization.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['React.js', 'Vite', 'Tailwind CSS', 'React Router', 'Axios', 'GSAP', 'Recharts', 'Lucide Icons'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/pets">
            <Button variant="primary" size="md">
              Explore Available Pets
            </Button>
          </Link>
          <Link to="/recommendations">
            <Button variant="outline" size="md">
              Try AI Matchmaker
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
