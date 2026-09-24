import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Sparkles,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, projectsAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const DesignerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [marketplaceProjects, setMarketplaceProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesignerData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, assignedRes, marketRes] = await Promise.all([
          analyticsAPI.getDesigner(),
          projectsAPI.getProjects({ scope: 'assigned' }),
          projectsAPI.getProjects({ status: 'REQUESTED', limit: 4 }),
        ]);

        setAnalytics(analyticsRes.data?.data || null);
        setAssignedProjects(assignedRes.data?.data || []);
        setMarketplaceProjects(marketRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load designer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignerData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Opening Designer Studio..." />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
              Design Atelier Studio
            </span>
            {user?.isVerified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
                Verified Designer
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
            Studio of {user?.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Review spatial requirements, generate high-fidelity proposals, manage client revision loops, and oversee design implementation.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/projects')}
            icon={Palette}
          >
            Explore Design Projects
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Projects"
          value={analytics?.assignedProjects || 0}
          subtitle={`${analytics?.activeProjects || 0} currently designing`}
          icon={Palette}
          variant="sky"
        />
        <StatCard
          title="Proposals Under Review"
          value={analytics?.pendingProposals || 0}
          subtitle="Awaiting client decision"
          icon={Send}
          variant="rose"
        />
        <StatCard
          title="Approved Concepts"
          value={analytics?.approvedProposals || 0}
          subtitle="Ready for contractor fit-out"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Estimated Project Value"
          value={`$${(analytics?.totalEstimatedValue || 0).toLocaleString()}`}
          subtitle="Signed proposals pipeline"
          icon={DollarSign}
          variant="sky"
        />
      </div>

      {/* Open Project Opportunities (Marketplace) */}
      {marketplaceProjects.length > 0 && (
        <GlassCard className="border-sky-400/30 bg-sky-500/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-serif font-bold text-slate-100">
                Open Client Project Requests ({marketplaceProjects.length})
              </h3>
            </div>
            <span className="text-xs text-sky-400">Available to submit proposals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceProjects.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/projects/${p._id}`)}
                className="p-4 rounded-xl glass-panel border-sky-400/20 hover:border-sky-400/50 transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-sky-300">
                      {p.projectType} • {p.propertyType}
                    </span>
                    <span className="text-slate-400">{p.location}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-300">
                    Client Budget: <strong className="text-slate-100">${p.totalBudget?.toLocaleString()}</strong>
                  </span>
                  <Button variant="primary" size="sm" icon={Send}>
                    Draft Proposal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Active Studio Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-slate-100">
            Active Studio Assignments
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={ArrowRight}
          >
            All Projects
          </Button>
        </div>

        {assignedProjects.length === 0 ? (
          <EmptyState
            icon={Palette}
            title="No assigned projects currently"
            description="Explore open client requests above and submit design proposals to win project commissions."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedProjects.map((project) => (
              <GlassCard
                key={project._id}
                hoverEffect
                onClick={() => navigate(`/projects/${project._id}`)}
                className="flex flex-col justify-between p-0 overflow-hidden border-sky-400/20"
              >
                <div className="relative h-40 w-full bg-charcoal-800">
                  <img
                    src={
                      project.images?.[0] ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={project.status} />
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <h4 className="text-base font-serif font-bold text-slate-100 line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Client: {project.client?.name || 'Private Client'}
                    </p>
                  </div>

                  <ProgressBar progress={project.progress || 0} />

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Target Style: <strong className="text-sky-300">{project.preferredStyle}</strong></span>
                    <span className="text-sky-400 font-medium flex items-center gap-1">
                      Open Studio <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerDashboard;
