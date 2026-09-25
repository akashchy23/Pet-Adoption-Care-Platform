import React, { useState } from 'react';
import { MapPin, Calendar, Phone, AlertTriangle, ShieldCheck, Heart, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/formatters';

export const LostFoundCard = ({ report, onDelete }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isLost = report.type === 'Lost';

  const handleDelete = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!window.confirm(`Are you sure you want to delete the report for "${report.petName}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      if (onDelete) {
        await onDelete(report.id || report.customId);
      }
      setShowContactModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group">
        <div>
          {/* Image Banner */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
            <img
              src={report.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80'}
              alt={report.petName}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  isLost
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {report.type === 'Lost' ? '🚨 LOST PET' : '🐾 FOUND PET'}
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {report.reward && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                  Reward: {report.reward}
                </span>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Delete this pet report"
                  aria-label="Delete pet report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {report.petName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {report.breed} • {report.color} ({report.gender})
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{report.lastSeenLocation}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Last Seen: {formatDate(report.lastSeenDate)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
              {report.description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 pt-0 flex items-center gap-2">
          <Button
            variant={isLost ? 'danger' : 'secondary'}
            size="sm"
            icon={Phone}
            onClick={() => setShowContactModal(true)}
            className="flex-1"
          >
            {isLost ? 'I Have Seen This Pet' : 'Contact Finder'}
          </Button>
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete pet report"
              aria-label="Delete pet report"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contact Details Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title={isLost ? `Help Find ${report.petName}` : `Claim / Contact for ${report.petName}`}
        subtitle={`Report ID: ${report.id || report.customId}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Contact</p>
            <p className="text-base font-bold text-slate-900">{report.contactName}</p>
            <div className="flex items-center gap-2 text-teal-700 font-semibold">
              <Phone className="w-4 h-4" />
              <a href={`tel:${report.contactPhone}`} className="hover:underline">
                {report.contactPhone}
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-700 mb-1">Safety Note:</p>
            When meeting regarding a lost or found animal, arrange to meet in a public location or local veterinary clinic for microchip scanning.
          </div>

          <div className="flex items-center gap-2 pt-2">
            {onDelete && (
              <Button
                variant="outline"
                size="md"
                icon={Trash2}
                onClick={handleDelete}
                isLoading={deleting}
                className="text-rose-600 hover:bg-rose-50 hover:border-rose-300"
              >
                Delete Report
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowContactModal(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
