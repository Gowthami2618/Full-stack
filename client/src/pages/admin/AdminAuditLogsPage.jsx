import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, History } from 'lucide-react';
import { auditLogsAPI } from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await auditLogsAPI.getAuditLogs({
        page,
        limit: 15,
        search: search || undefined,
        entityType: entityFilter !== 'ALL' ? entityFilter : undefined,
      });

      if (res.data?.data) {
        setLogs(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, entityFilter]);

  const filterOptions = [
    {
      id: 'entity',
      label: 'Entity Type',
      value: entityFilter,
      onChange: setEntityFilter,
      options: [
        { label: 'All Entities', value: 'ALL' },
        { label: 'Auth', value: 'AUTH' },
        { label: 'User', value: 'USER' },
        { label: 'Project', value: 'PROJECT' },
        { label: 'Proposal', value: 'PROPOSAL' },
        { label: 'Revision', value: 'REVISION' },
        { label: 'Task', value: 'TASK' },
        { label: 'Expense', value: 'EXPENSE' },
        { label: 'System', value: 'SYSTEM' },
      ],
    },
  ];

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(row.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="font-semibold text-sky-600 dark:text-sky-300 text-xs">{row.action}</span>
      ),
    },
    {
      header: 'Entity',
      accessor: 'entityType',
      render: (row) => (
        <Badge variant="sky" size="sm">
          {row.entityType}
        </Badge>
      ),
    },
    {
      header: 'Actor',
      accessor: 'user',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{row.user?.name || 'System / Guest'}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.user?.role || 'SYSTEM'}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span className="text-xs text-slate-600 dark:text-slate-300">{row.description}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
          Platform Audit & Security Logs
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Immutable event trails of user authentications, financial entries, and project status modifications.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by action or keyword..."
        />

        <FilterPanel
          filters={filterOptions}
          onReset={() => {
            setSearch('');
            setEntityFilter('ALL');
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={logs}
        isLoading={loading}
        emptyMessage="No audit logs recorded matching search criteria."
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => fetchLogs(p)}
      />
    </div>
  );
};

export default AdminAuditLogsPage;
