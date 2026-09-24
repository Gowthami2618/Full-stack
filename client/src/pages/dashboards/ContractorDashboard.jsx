import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hammer,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, projectsAPI, tasksAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const ContractorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes, tasksRes] = await Promise.all([
        analyticsAPI.getContractor(),
        projectsAPI.getProjects({ scope: 'assigned' }),
        tasksAPI.getTasks({ assignedTo: user._id }),
      ]);

      setAnalytics(analyticsRes.data?.data || null);
      setAssignedProjects(projectsRes.data?.data || []);
      setTasks(tasksRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load contractor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to Site Execution Hub..." />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
              Construction & Fit-out Hub
            </span>
            {user?.isVerified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
                Verified Contractor
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
            {user?.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Oversee on-site interior fit-out tasks, manage material procurement, log work receipts, and report completion milestones.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/projects')}
            icon={Hammer}
          >
            Assigned Build Sites
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Projects"
          value={analytics?.assignedProjects || 0}
          subtitle={`${analytics?.inProgressProjects || 0} under execution`}
          icon={Hammer}
          variant="sky"
        />
        <StatCard
          title="Pending Site Tasks"
          value={analytics?.pendingTasks || 0}
          subtitle="Action items requiring work"
          icon={ListTodo}
          variant="rose"
        />
        <StatCard
          title="Completed Tasks"
          value={analytics?.completedTasks || 0}
          subtitle="Successfully verified"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Completed Projects"
          value={analytics?.completedProjects || 0}
          subtitle="Delivered handovers"
          icon={Clock}
          variant="sky"
        />
      </div>

      {/* Immediate Tasks Queue */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-serif font-bold text-slate-100">
              Site Tasks Queue ({tasks.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Update progress directly</span>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All tasks completed"
            description="You currently have no pending tasks assigned."
          />
        ) : (
          <div className="divide-y divide-white/5">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {task.title}
                    </span>
                    <StatusBadge status={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-xs text-slate-400">{task.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400/80 mt-0.5">
                    <span>Project: {task.project?.title || 'Interior Project'}</span>
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {task.status !== 'COMPLETED' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTaskStatusChange(task._id, 'COMPLETED')}
                      icon={CheckCircle2}
                    >
                      Mark Complete
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Finished
                    </span>
                  )}
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => navigate(`/projects/${task.project?._id || task.project}`)}
                  >
                    Open Site
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Active Construction Sites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-slate-100">
            Active Construction Fit-outs
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={ArrowRight}
          >
            All Sites
          </Button>
        </div>

        {assignedProjects.length === 0 ? (
          <EmptyState
            icon={Hammer}
            title="No projects currently assigned"
            description="When clients or designers assign your firm to a project, it will appear here."
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
                      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
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
                    <p className="text-xs text-slate-400 mt-0.5">
                      Location: {project.location}
                    </p>
                  </div>

                  <ProgressBar progress={project.progress || 0} />

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Budget: <strong className="text-slate-200">${project.totalBudget?.toLocaleString()}</strong></span>
                    <span className="text-sky-400 font-medium flex items-center gap-1">
                      Manage Fit-out <ArrowRight className="w-3.5 h-3.5" />
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

export default ContractorDashboard;
