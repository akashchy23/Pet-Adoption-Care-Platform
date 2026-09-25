import React, { useState, useEffect } from 'react';
import { petApi } from '../../api/petApi';
import { DataTable } from '../../components/tables/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PetFormModal } from '../../components/forms/PetFormModal';
import { formatCurrency } from '../../utils/formatters';
import { Search, PawPrint, Eye, Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

export const AdminPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const { success, error } = useToast();

  const debouncedSearch = useDebounce(search, 300);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await petApi.getPets({ search: debouncedSearch, limit: 100 });
      setPets(res.pets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [debouncedSearch]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the database?`)) return;
    try {
      await petApi.deletePet(id);
      success(`Removed "${name}" from database.`);
      fetchPets();
    } catch (err) {
      error(err.message || 'Failed to delete pet.');
    }
  };

  const columns = [
    {
      header: 'Pet Profile',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.primaryImage}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.breed} ({row.species})</p>
          </div>
        </div>
      )
    },
    {
      header: 'Microchip ID',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {row.microchipId || 'CHIP-984210'}
        </span>
      )
    },
    {
      header: 'Shelter / Branch',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.shelterName || (row.ownerName ? `Owner: ${row.ownerName}` : 'Happy Paws Rescue')}
        </span>
      )
    },
    {
      header: 'Adoption Fee',
      render: (row) => <span className="font-bold text-slate-800">{formatCurrency(row.adoptionFee)}</span>
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} size="sm" />
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link to={`/pets/${row.id}`}>
            <Button variant="ghost" size="sm" icon={Eye} title="View Details">
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit2}
            onClick={() => setEditingPet(row)}
            title="Edit Pet"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(row.id, row.name)}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            title="Delete Pet"
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
            Master Pets & Sanctuary Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Global pet database across all registered shelters, owner registrations, and animal sanctuaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              icon={Search}
              placeholder="Search pets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            className="shrink-0"
          >
            Register Pet
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pets}
        isLoading={loading}
        emptyMessage="No pets found in database."
      />

      {(showAddModal || editingPet) && (
        <PetFormModal
          isOpen={showAddModal || !!editingPet}
          pet={editingPet}
          onClose={() => {
            setShowAddModal(false);
            setEditingPet(null);
          }}
          onSuccess={() => {
            fetchPets();
            setShowAddModal(false);
            setEditingPet(null);
          }}
        />
      )}
    </div>
  );
};
