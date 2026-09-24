import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  FileSpreadsheet,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, projectsAPI, proposalsAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, projectsRes, proposalsRes] = await Promise.all([
          analyticsAPI.getClient(),
          projectsAPI.getProjects({ limit: 4 }),
          proposalsAPI.getProposals({ status: 'SENT' }),
        ]);

        setAnalytics(analyticsRes.data?.data || null);
        setProjects(projectsRes.data?.data || []);
        setProposals(proposalsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load client dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading client portal..." />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
            Client Atelier Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Track your ongoing interior design transformations, review design concepts, and monitor project finances in real time.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/client/projects/new')}
            icon={Plus}
          >
            Start New Project
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={analytics?.totalProjects || 0}
          subtitle={`${analytics?.activeProjects || 0} currently active`}
          icon={FolderKanban}
          variant="sky"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Pending Proposals"
          value={analytics?.pendingProposals || 0}
          subtitle="Awaiting your review"
          icon={Sparkles}
          variant="rose"
        />
        <StatCard
          title="Committed Budget"
          value={`$${(analytics?.totalBudget || 0).toLocaleString()}`}
          subtitle="Across all spaces"
          icon={DollarSign}
          variant="sky"
        />
        <StatCard
          title="Total Incurred"
          value={`$${(analytics?.totalSpent || 0).toLocaleString()}`}
          subtitle="Verified expenses"
          icon={FileSpreadsheet}
          variant="emerald"
        />
      </div>

      {/* Action Required: Pending Proposals Notice */}
      {proposals.length > 0 && (
        <GlassCard className="border-sky-400/30 bg-sky-500/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-slate-100">
                Design Concepts Awaiting Your Decision ({proposals.length})
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((proposal) => (
              <div
                key={proposal._id}
                onClick={() => navigate(`/projects/${proposal.project?._id || proposal.project}`)}
                className="p-4 rounded-xl glass-panel border-sky-400/20 hover:border-sky-400/50 transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-sky-300">
                      {proposal.project?.title || 'Interior Project'}
                    </span>
                    <StatusBadge status={proposal.status} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{proposal.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {proposal.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-300">
                    Est. Cost: <strong className="text-sky-400">${proposal.estimatedCost?.toLocaleString()}</strong>
                  </span>
                  <span className="text-sky-400 font-medium flex items-center gap-1">
                    Review Proposal <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Active Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-slate-100">
            Active Transformations
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={ArrowRight}
          >
            View All Projects
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects created yet"
            description="Create your first interior design project to begin connecting with world-class interior designers."
            actionText="Start Project Now"
            onAction={() => navigate('/client/projects/new')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <GlassCard
                key={project._id}
                hoverEffect
                onClick={() => navigate(`/projects/${project._id}`)}
                className="flex flex-col justify-between p-0 overflow-hidden border-sky-400/20"
              >
                {/* Project Image Header */}
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
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-charcoal-950/85 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-sky-400/20">
                    {project.projectType} • {project.propertyType}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                  <div>
                    <h4 className="text-base font-serif font-bold text-slate-100 line-clamp-1 mb-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <ProgressBar progress={project.progress || 0} />

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      Budget:{' '}
                      <span className="font-semibold text-slate-200">
                        ${project.totalBudget?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sky-400 font-medium flex items-center gap-1">
                      Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Milestones */}
      {analytics?.upcomingMilestones?.length > 0 && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-serif font-bold text-slate-100">
              Upcoming Project Milestones
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {analytics.upcomingMilestones.map((m) => (
              <div key={m._id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-100">{m.title}</span>
                  <span className="text-slate-400 text-[11px]">
                    Project: {m.project?.title || 'Interior Project'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">
                    Due: {new Date(m.dueDate).toLocaleDateString()}
                  </span>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ClientDashboard;
