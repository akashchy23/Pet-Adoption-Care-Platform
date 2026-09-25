import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatters';

export const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  showActions = true
}) => {
  const isCancelled = appointment.status === 'Cancelled';
  const isCompleted = appointment.status === 'Completed';

  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm font-heading">
                {appointment.reason}
              </h4>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-bold text-slate-800">{appointment.petName}</span>
              </p>
            </div>
          </div>
          <Badge status={appointment.status} size="sm" />
        </div>

        {/* Vet & Clinic Info */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 text-xs text-slate-700">
          <p className="font-bold text-slate-900">{appointment.vetName}</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{appointment.clinicName}</span>
          </div>
        </div>

        {/* Date / Time */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold">{appointment.time}</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-xl border border-amber-100/80">
            "{appointment.notes}"
          </p>
        )}
      </div>

      {/* Action buttons */}
      {showActions && !isCancelled && !isCompleted && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {onReschedule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule(appointment)}
              className="flex-1"
            >
              Reschedule
            </Button>
          )}
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(appointment.id)}
              className="text-rose-600 hover:bg-rose-50"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
