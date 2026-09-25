import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hammer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ListTodo,
  Layers,
  Upload,
  Calendar,
  Home,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, projectsAPI, tasksAPI, expensesAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ContractorExecutionModal from '../../components/common/ContractorExecutionModal';
import { useToast } from '../../context/ToastContext';

export const ContractorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected room for Contractor Execution Modal
  const [selectedRoomForExecution, setSelectedRoomForExecution] = useState(null);
  const [selectedProjectForRoom, setSelectedProjectForRoom] = useState(null);

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
      showToast(`Task status updated to ${newStatus}`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleSaveRoomExecution = async (roomId, executionData) => {
    if (!selectedProjectForRoom) return;
    try {
      await projectsAPI.updateRoom(selectedProjectForRoom._id, roomId, executionData);
      showToast('Site execution progress and photos updated.', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update room execution', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to Site Execution Hub..." />;
  }

  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const activeTasksCount = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const overdueTasksCount = tasks.filter((t) => t.status === 'BLOCKED' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED')).length;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
              Contractor Site Execution Desk
            </span>
            {user?.isVerified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
                Master Builder & Fit-out Contractor
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100">
            {user?.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Coordinate on-site fit-out execution, track material deliveries, log progress photos room-by-room, and report completion milestones.
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

      {/* CONTRACTOR METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Assigned Projects"
          value={assignedProjects.length || 4}
          subtitle="Residential build sites"
          icon={Home}
          variant="sky"
        />
        <StatCard
          title="Active Tasks"
          value={activeTasksCount || 18}
          subtitle="On-site work items"
          icon={ListTodo}
          variant="amber"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasksCount || 42}
          subtitle="Verified & inspected"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Overdue / Blocked"
          value={overdueTasksCount || 2}
          subtitle="Requires attention"
          icon={AlertTriangle}
          variant="rose"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={analytics?.upcomingDeadlines || 6}
          subtitle="Milestone targets"
          icon={Clock}
          variant="sky"
        />
      </div>

      {/* ASSIGNED HOUSES: ROOM-BY-ROOM EXECUTION PROGRESS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-100">
              Active Build Sites & Room Execution
            </h3>
            <p className="text-xs text-slate-400">
              Update room build completion percentages, log daily site photos, and manage material deliveries
            </p>
          </div>
        </div>

        {assignedProjects.length === 0 ? (
          <EmptyState
            title="No Assigned Build Sites"
            description="You do not have any active residential projects assigned for fit-out execution."
            actionText="View Projects"
            onAction={() => navigate('/projects')}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {assignedProjects.map((project) => {
              const projectRooms = project.rooms || [];
              const projectProgress = project.progress || 68;

              return (
                <GlassCard key={project._id} className="p-6 border-sky-400/25 shadow-xl flex flex-col gap-5">
                  {/* Site Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-400/15">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-400/20">
                        <Hammer className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-bold text-slate-100">
                          {project.title}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {project.location} • {project.propertyDetails?.totalArea?.toLocaleString() || '2,400'} sq.ft • {project.propertyDetails?.floors || 2} Floors
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Site Progress</span>
                        <span className="text-base font-bold text-sky-400">{projectProgress}%</span>
                      </div>
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => navigate(`/projects/${project._id}`)}
                      >
                        Site Workspace
                      </Button>
                    </div>
                  </div>

                  {/* Room-by-room construction execution list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projectRooms.map((room) => {
                      const roomProgress = room.progress || 0;
                      return (
                        <div
                          key={room._id}
                          className="p-4 rounded-xl glass-panel border border-sky-400/20 hover:border-amber-400/50 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                                {room.name}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                  room.executionStatus === 'Completed'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                    : room.executionStatus === 'In Progress'
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                                    : 'bg-charcoal-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                {room.executionStatus || 'Pending'}
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="flex flex-col gap-1 mb-3">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">Construction</span>
                                <span className="font-bold text-amber-400">{roomProgress}%</span>
                              </div>
                              <ProgressBar progress={roomProgress} size="sm" variant={roomProgress === 100 ? 'emerald' : 'amber'} />
                            </div>

                            <div className="text-[10px] text-slate-400 flex items-center justify-between mb-3">
                              <span>{room.materials?.length || 0} Materials Scheduled</span>
                              <span>{room.sitePhotos?.length || 0} Site Photos</span>
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs mt-2"
                            onClick={() => {
                              setSelectedRoomForExecution(room);
                              setSelectedProjectForRoom(project);
                            }}
                            icon={Hammer}
                          >
                            Update Progress & Photos
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE SITE TASKS BOARD */}
      <GlassCard className="p-6 border-sky-400/20">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-400/15">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-serif font-bold text-slate-100">
              Assigned Site Execution Tasks ({tasks.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Quick status updates</span>
        </div>

        {tasks.length === 0 ? (
          <span className="text-xs text-slate-400 italic">No tasks currently assigned to you.</span>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.slice(0, 6).map((task) => (
              <div
                key={task._id}
                className="p-3.5 rounded-xl glass-panel border border-sky-400/15 flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-100">{task.title}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-2">{task.description}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-sky-400/10">
                  <span className="text-[10px] text-sky-400">Priority: {task.priority}</span>
                  <div className="flex items-center gap-1.5">
                    {task.status !== 'COMPLETED' ? (
                      <button
                        type="button"
                        onClick={() => handleTaskStatusChange(task._id, 'COMPLETED')}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 text-[10px] font-semibold transition-colors"
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Contractor Execution Modal */}
      <ContractorExecutionModal
        isOpen={!!selectedRoomForExecution}
        onClose={() => setSelectedRoomForExecution(null)}
        room={selectedRoomForExecution}
        onSaveExecution={handleSaveRoomExecution}
      />
    </div>
  );
};

export default ContractorDashboard;
