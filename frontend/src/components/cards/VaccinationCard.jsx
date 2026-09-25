import React from 'react';
import { Syringe, Calendar, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const VaccinationCard = ({ vaccination, onActionClick }) => {
  const isOverdue = vaccination.status === 'Overdue';
  const isUpcoming = vaccination.status === 'Upcoming';

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-200 bg-white ${
        isOverdue
          ? 'border-rose-200 bg-rose-50/30 shadow-sm'
          : isUpcoming
          ? 'border-amber-200 bg-amber-50/20 shadow-sm'
          : 'border-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${
              isOverdue
                ? 'bg-rose-100 text-rose-600'
                : isUpcoming
                ? 'bg-amber-100 text-amber-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <Syringe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm font-heading">
              {vaccination.vaccineName}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Pet: <span className="font-bold text-slate-800">{vaccination.petName}</span> ({vaccination.petSpecies})
            </p>
          </div>
        </div>
        <Badge status={vaccination.status} size="sm" />
      </div>

      {/* Reminder Alert Banner */}
      {vaccination.reminderNotes && (
        <div
          className={`mt-3.5 p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
            isOverdue
              ? 'bg-rose-100/80 text-rose-800 border border-rose-200'
              : isUpcoming
              ? 'bg-amber-100/80 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {isOverdue && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          {isUpcoming && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
          {!isOverdue && !isUpcoming && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
          <span>{vaccination.reminderNotes}</span>
        </div>
      )}

      {/* Details Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Administered</span>
          <span className="font-semibold">{formatDate(vaccination.givenDate)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Due Date</span>
          <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
            {formatDate(vaccination.dueDate)}
          </span>
        </div>
      </div>

      {/* Action if upcoming / overdue */}
      {(isOverdue || isUpcoming) && (
        <div className="mt-4 pt-2">
          <Link to="/vets">
            <Button
              variant={isOverdue ? 'danger' : 'amber'}
              size="sm"
              icon={Calendar}
              className="w-full"
            >
              Book Vet Appointment
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
