import React from 'react';
import { Star, MapPin, Phone, Calendar, Clock, Stethoscope } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

export const VetCard = ({ vet, onBookClick }) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5">
      <div className="flex items-start gap-4">
        <img
          src={vet.avatar}
          alt={vet.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-heading">{vet.name}</h3>
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{vet.rating}</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-teal-700 mt-0.5">{vet.specialization}</p>
          <p className="text-xs text-slate-500 mt-0.5">{vet.clinicName}</p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-2 py-2 border-y border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">{vet.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{vet.experienceYears} Years Experience</span>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-slate-900">{formatCurrency(vet.consultationFee)}</span>
          <span className="text-slate-400">/ visit</span>
        </div>
      </div>

      {/* Available Slots Preview */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Next Available Time Slots
        </span>
        <div className="flex flex-wrap gap-1.5">
          {vet.timeSlots?.slice(0, 3).map((slot, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100 text-xs font-medium"
            >
              {slot}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        size="md"
        icon={Calendar}
        onClick={() => onBookClick && onBookClick(vet)}
        className="w-full shadow-sm"
      >
        Book Consultation
      </Button>
    </div>
  );
};
