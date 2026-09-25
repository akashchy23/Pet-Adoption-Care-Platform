import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { UsersManagementTable } from '../../components/tables/UsersManagementTable';
import { UserFormModal } from '../../components/forms/UserFormModal';
import { TabView } from '../../components/common/TabView';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, UserPlus } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [activeRole, setActiveRole] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { success, error } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authApi.getUsers();
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}" from the system?`)) return;
    try {
      await authApi.deleteUser(id);
      success(`User "${name}" has been removed from database.`);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to remove user account.');
    }
  };

  const filtered = users.filter((u) => {
    if (activeRole !== 'All' && u.role !== activeRole) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            System User Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage user accounts, assign roles (Adopter, Pet Owner, Vet, Admin), and oversee permissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => setShowAddModal(true)}
          className="shrink-0"
        >
          Add New User
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <TabView
          tabs={[
            { id: 'All', label: 'All Roles', count: users.length },
            { id: USER_ROLES.ADOPTER, label: 'Adopters' },
            { id: USER_ROLES.PET_OWNER, label: 'Owners' },
            { id: USER_ROLES.VETERINARIAN, label: 'Vets' },
            { id: USER_ROLES.ADMINISTRATOR, label: 'Admins' }
          ]}
          activeTab={activeRole}
          onTabChange={setActiveRole}
        />

        <div className="w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <UsersManagementTable
        users={filtered}
        isLoading={loading}
        onEdit={(u) => setEditingUser(u)}
        onDelete={handleDeleteUser}
      />

      {(showAddModal || editingUser) && (
        <UserFormModal
          isOpen={showAddModal || !!editingUser}
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
            setShowAddModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};
