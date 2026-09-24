import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  MapPin,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import DataTable from '../../components/common/DataTable';

export const ProjectsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: viewMode === 'grid' ? 9 : 12,
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        projectType: typeFilter !== 'ALL' ? typeFilter : undefined,
      };

      const res = await projectsAPI.getProjects(params);
      if (res.data?.data) {
        setProjects(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter, viewMode]);

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Requested', value: 'REQUESTED' },
        { label: 'Designing', value: 'DESIGNING' },
        { label: 'Proposal Sent', value: 'PROPOSAL_SENT' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
    {
      id: 'type',
      label: 'Space Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'All Space Types', value: 'ALL' },
        { label: 'Living Room', value: 'Living Room' },
        { label: 'Kitchen', value: 'Kitchen' },
        { label: 'Bedroom', value: 'Bedroom' },
        { label: 'Bathroom', value: 'Bathroom' },
        { label: 'Office', value: 'Office' },
        { label: 'Full Home', value: 'Full Home' },
        { label: 'Commercial', value: 'Commercial' },
      ],
    },
  ];

  const tableColumns = [
    {
      header: 'Project Title',
      accessor: 'title',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-100">{row.title}</span>
          <span className="text-xs text-slate-400">
            {row.projectType} • {row.propertyType}
          </span>
        </div>
      ),
    },
    {
      header: 'Client',
      accessor: 'client',
      render: (row) => row.client?.name || 'Private Client',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Budget',
      accessor: 'totalBudget',
      render: (row) => `$${row.totalBudget?.toLocaleString()}`,
    },
    {
      header: 'Progress',
      accessor: 'progress',
      render: (row) => <ProgressBar progress={row.progress || 0} showLabel={false} size="sm" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/projects/${row._id}`)}
          icon={ArrowRight}
        >
          Open
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
            Interior Projects Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and manage all interior architecture, design proposals, and site fit-outs.
          </p>
        </div>

        {['CLIENT', 'ADMIN'].includes(user?.role) && (
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/client/projects/new')}
            icon={Plus}
          >
            Create New Project
          </Button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by project name or location..."
        />

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <FilterPanel
            filters={filterOptions}
            onReset={() => {
              setSearch('');
              setStatusFilter('ALL');
              setTypeFilter('ALL');
            }}
          />

          <div className="hidden sm:flex items-center p-1 rounded-xl bg-charcoal-900 border border-sky-400/20 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Render Area */}
      {loading ? (
        <LoadingSpinner text="Querying project database..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match criteria"
          description="Try broadening your search or filter parameters to find projects."
          actionText={['CLIENT', 'ADMIN'].includes(user?.role) ? 'Create Project' : undefined}
          onAction={() => navigate('/client/projects/new')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <GlassCard
              key={project._id}
              hoverEffect
              onClick={() => navigate(`/projects/${project._id}`)}
              className="flex flex-col justify-between p-0 overflow-hidden border-sky-400/20"
            >
              <div className="relative h-44 w-full bg-charcoal-800">
                <img
                  src={
                    project.images?.[0] ||
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={project.status} />
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-charcoal-950/85 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-sky-400/20 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span className="truncate max-w-[160px]">{project.location}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-sky-400 font-medium mb-1">
                    <span>{project.projectType}</span>
                    <span>{project.propertyType}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-100 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>

                <ProgressBar progress={project.progress || 0} />

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    Budget:{' '}
                    <span className="font-semibold text-slate-100">
                      ${project.totalBudget?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sky-400 font-medium flex items-center gap-1">
                    Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={projects}
          onRowClick={(row) => navigate(`/projects/${row._id}`)}
        />
      )}

      {/* Pagination Footer */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => fetchProjects(p)}
      />
    </div>
  );
};

export default ProjectsListPage;
