import React, { useState, useEffect } from 'react';
import { shelterApi } from '../../api/shelterApi';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { AdminShelterModal } from '../../components/forms/AdminShelterModal';
import { Building, ShieldCheck, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSheltersPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const { success, error } = useToast();

  const loadShelters = async () => {
    setLoading(true);
    try {
      const data = await shelterApi.getShelters();
      setShelters(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, []);

  const handleDeleteShelter = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from registered sanctuaries?`)) return;
    try {
      await shelterApi.deleteShelter(id);
      success(`Removed ${name} from sanctuary network.`);
      loadShelters();
    } catch (err) {
      error(err.message || 'Failed to remove sanctuary.');
    }
  };

  const columns = [
    {
      header: 'Sanctuary Name',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.address}</p>
        </div>
      )
    },
    {
      header: 'Manager / Lead',
      accessor: 'managerName'
    },
    {
      header: 'Capacity Occupancy',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {row.currentPets} / {row.capacity} pets ({Math.round((row.currentPets / row.capacity) * 100)}%)
        </span>
      )
    },
    {
      header: 'Adoptions (YTD)',
      render: (row) => <span className="font-bold text-teal-700">{row.adoptionsThisYear}</span>
    },
    {
      header: 'Verification Status',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Non-Profit
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
            onClick={() => setEditingShelter(row)}
            title="Edit Sanctuary"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteShelter(row.id, row.name)}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            title="Remove Sanctuary"
          >
            Delete
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
            Partner Shelters & Sanctuaries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Verify sanctuary certifications, oversee capacity thresholds, track rehoming rates, and manage branch details.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
          className="shrink-0"
        >
          Add Sanctuary
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={shelters}
        isLoading={loading}
        emptyMessage="No partner shelters registered."
      />

      {(showAddModal || editingShelter) && (
        <AdminShelterModal
          isOpen={showAddModal || !!editingShelter}
          shelter={editingShelter}
          onClose={() => {
            setShowAddModal(false);
            setEditingShelter(null);
          }}
          onSuccess={() => {
            loadShelters();
            setShowAddModal(false);
            setEditingShelter(null);
          }}
        />
      )}
    </div>
  );
};
