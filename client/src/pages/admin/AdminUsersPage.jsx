import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle2, XCircle, ShieldCheck, Award } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const AdminUsersPage = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [verifyFilter, setVerifyFilter] = useState('ALL');

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await usersAPI.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        isVerified: verifyFilter !== 'ALL' ? verifyFilter : undefined,
      });

      if (res.data?.data) {
        setUsers(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, verifyFilter]);

  const handleToggleStatus = async (user) => {
    try {
      const res = await usersAPI.toggleStatus(user._id);
      showToast(`User ${user.name} status updated.`, 'success');
      fetchUsers(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleVerify = async (user) => {
    try {
      await usersAPI.verifyUser(user._id);
      showToast(`${user.name} verified as professional!`, 'success');
      fetchUsers(pagination.page);
    } catch (err) {
      showToast('Failed to verify user', 'error');
    }
  };

  const filterOptions = [
    {
      id: 'role',
      label: 'Role',
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { label: 'All Roles', value: 'ALL' },
        { label: 'Client', value: 'CLIENT' },
        { label: 'Designer', value: 'DESIGNER' },
        { label: 'Contractor', value: 'CONTRACTOR' },
        { label: 'Admin', value: 'ADMIN' },
      ],
    },
    {
      id: 'verify',
      label: 'Verification',
      value: verifyFilter,
      onChange: setVerifyFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Verified', value: 'true' },
        { label: 'Unverified', value: 'false' },
      ],
    },
  ];

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.profileImage} name={row.name} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-950 dark:text-white">{row.name}</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <Badge
          variant={
            row.role === 'ADMIN'
              ? 'purple'
              : row.role === 'DESIGNER'
              ? 'sky'
              : row.role === 'CONTRACTOR'
              ? 'blue'
              : 'default'
          }
          size="sm"
        >
          {row.role}
        </Badge>
      ),
    },
    {
      header: 'Verification',
      accessor: 'isVerified',
      render: (row) => (
        row.isVerified ? (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        ) : (
          <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">Pending</span>
        )
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            row.isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20'
          }`}
        >
          {row.isActive ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isVerified && ['DESIGNER', 'CONTRACTOR'].includes(row.role) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleVerify(row)}
              icon={Award}
            >
              Verify
            </Button>
          )}
          {row.role !== 'ADMIN' && (
            <Button
              variant={row.isActive ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => handleToggleStatus(row)}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
          User Directory & Governance
        </h1>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
          Review user accounts, verify architectural designers, and manage platform permissions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by user name or email address..."
        />

        <FilterPanel
          filters={filterOptions}
          onReset={() => {
            setSearch('');
            setRoleFilter('ALL');
            setVerifyFilter('ALL');
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={loading}
        emptyMessage="No users match the search criteria."
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => fetchUsers(p)}
      />
    </div>
  );
};

export default AdminUsersPage;
