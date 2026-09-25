import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { AdminVetModal } from '../../components/forms/AdminVetModal';
import { Star, Stethoscope, ShieldCheck, Edit2, Trash2, Info, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminVetsPage = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVet, setEditingVet] = useState(null);
  const { success, error } = useToast();

  const loadVets = async () => {
    setLoading(true);
    try {
      const data = await appointmentApi.getVets();
      setVets(data || []);
    } catch (err) {
      console.error(err);
      error('Failed to load veterinarians from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVets();
  }, []);

  const handleDeleteVet = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from certified veterinary directory?`)) return;
    try {
      await appointmentApi.deleteVet(id);
      success(`Removed ${name} from veterinary directory.`);
      loadVets();
    } catch (err) {
      error(err.message || 'Failed to remove veterinarian.');
    }
  };

  const columns = [
    {
      header: 'Veterinarian',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.clinicName}</p>
            {row.email && (
              <p className="text-[11px] text-teal-700 font-mono">{row.email}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Specialization',
      accessor: 'specialization'
    },
    {
      header: 'Experience',
      render: (row) => <span className="text-xs text-slate-700 font-semibold">{row.experienceYears || 5} Years</span>
    },
    {
      header: 'Consultation Fee',
      render: (row) => <span className="font-bold text-slate-800">{formatCurrency(row.consultationFee || 75)}</span>
    },
    {
      header: 'Rating & Reviews',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{row.rating || 5.0} ({row.reviewCount || 1})</span>
        </div>
      )
    },
    {
      header: 'License Verification',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> DVM Verified
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit2}
            onClick={() => setEditingVet(row)}
            title="Edit Doctor Details"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteVet(row.id || row.customId, row.name)}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            title="Remove Doctor From Directory"
          >
            Remove
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Certified Veterinarians Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Doctors self-register their accounts. Admins can review profiles and remove veterinarians when necessary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Informational notice: Admin cannot add veterinarians; only self-registration is permitted */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            Self-Registration Only (Admin Cannot Add)
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={loadVets}
            isLoading={loading}
            title="Refresh Directory"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Admin Policy:</strong> Veterinarians create and manage their own clinical profiles during registration. Administrators have permission to review, edit, or remove listings from the active directory.
        </span>
      </div>

      <DataTable
        columns={columns}
        data={vets}
        isLoading={loading}
        emptyMessage="No veterinarians registered in database."
      />

      {editingVet && (
        <AdminVetModal
          isOpen={!!editingVet}
          vet={editingVet}
          onClose={() => setEditingVet(null)}
          onSuccess={() => {
            loadVets();
            setEditingVet(null);
          }}
        />
      )}
    </div>
  );
};
