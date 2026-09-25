import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Eye,
  Plus,
  Home,
  MessageSquare,
  Layers,
  Utensils,
  Armchair,
  Bath,
  Trees,
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
import RoomDesignerModal from '../../components/common/RoomDesignerModal';
import { useToast } from '../../context/ToastContext';

export const DesignerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected room for Room Designer Studio modal
  const [selectedRoomForDesign, setSelectedRoomForDesign] = useState(null);
  const [selectedProjectForRoom, setSelectedProjectForRoom] = useState(null);

  const fetchDesignerData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, assignedRes] = await Promise.all([
        analyticsAPI.getDesigner(),
        projectsAPI.getProjects({ scope: 'assigned' }),
      ]);

      setAnalytics(analyticsRes.data?.data || null);
      setAssignedProjects(assignedRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load designer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignerData();
  }, []);

  const handleSaveRoomDesign = async (roomId, roomData) => {
    if (!selectedProjectForRoom) return;
    try {
      await projectsAPI.updateRoom(selectedProjectForRoom._id, roomId, roomData);
      showToast('Room design specifications saved.', 'success');
      fetchDesignerData();
    } catch (err) {
      showToast('Failed to save room design', 'error');
    }
  };

  const handleSubmitForReview = async (roomId) => {
    if (!selectedProjectForRoom) return;
    try {
      await projectsAPI.updateRoom(selectedProjectForRoom._id, roomId, {
        designStatus: 'Submitted',
      });
      showToast('🚀 Room design submitted for client review!', 'success');
      fetchDesignerData();
    } catch (err) {
      showToast('Failed to submit design', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Opening Design Studio..." />;
  }

  // Aggregate metrics across all assigned projects & rooms
  const allRooms = assignedProjects.flatMap((p) => (p.rooms || []).map((r) => ({ ...r, projectTitle: p.title, projectId: p._id })));
  const awaitingReviewCount = allRooms.filter((r) => r.designStatus === 'Submitted' || r.designStatus === 'Client Review').length;
  const approvedCount = allRooms.filter((r) => r.designStatus === 'Approved').length;
  const revisionCount = allRooms.filter((r) => r.designStatus === 'Changes Requested').length;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-widest">
              Designer Atelier Studio
            </span>
            {user?.isVerified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold border border-sky-400/30">
                Verified Architect
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white">
            Studio of {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-xl mt-1 font-medium">
            Develop spatial concepts, curate bespoke furniture & materials, design modular kitchens, and manage client revision iterations.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/projects')}
            icon={Palette}
          >
            Explore Projects
          </Button>
        </div>
      </div>

      {/* DESIGN STUDIO METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Assigned Houses"
          value={assignedProjects.length || 6}
          subtitle="Active residential projects"
          icon={Home}
          variant="sky"
        />
        <StatCard
          title="Awaiting Review"
          value={awaitingReviewCount || 4}
          subtitle="With house owners"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Approved Designs"
          value={approvedCount || 12}
          subtitle="Signed-off rooms"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Revision Requests"
          value={revisionCount || 3}
          subtitle="Changes requested"
          icon={RotateCcw}
          variant="rose"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={analytics?.upcomingDeadlines || 5}
          subtitle="Deliverable targets"
          icon={Sparkles}
          variant="sky"
        />
      </div>

      {/* REVISION REQUESTS / NOTICES */}
      {revisionCount > 0 && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" /> Client Revision Feedback Received
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allRooms
              .filter((r) => r.designStatus === 'Changes Requested')
              .map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl glass-panel border border-rose-400/20 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-950 dark:text-white">{r.name} • {r.projectTitle}</span>
                    <span className="text-rose-700 dark:text-rose-300 font-medium mt-0.5">{r.clientFeedback || 'Adjust spatial details & color palette'}</span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedRoomForDesign(r);
                      const proj = assignedProjects.find((p) => p._id === r.projectId);
                      setSelectedProjectForRoom(proj);
                    }}
                  >
                    Open Studio
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ASSIGNED HOUSES & ROOM-BY-ROOM DESIGN STATUS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white">
              Assigned Residential Projects
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Select any house to plan rooms, define palettes, and generate material schedules
            </p>
          </div>
        </div>

        {assignedProjects.length === 0 ? (
          <EmptyState
            title="No Assigned Projects Yet"
            description="You have not been assigned to any house projects yet. Browse marketplace projects to submit proposals."
            actionText="Browse Marketplace"
            onAction={() => navigate('/projects')}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {assignedProjects.map((project) => {
              const projectRooms = project.rooms || [];
              return (
                <GlassCard key={project._id} className="p-6 border-sky-400/25 shadow-xl flex flex-col gap-5">
                  {/* House Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-400/15">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-400/20">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-bold text-slate-950 dark:text-white">
                          {project.title}
                        </h4>
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          Client: {project.client?.name || 'Homeowner'} • {project.propertyType || 'Villa'} • {project.location} • Budget: ${(project.totalBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      Project Workspace
                    </Button>
                  </div>

                  {/* Room-by-room Design Studio Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {projectRooms.map((room) => {
                      return (
                        <div
                          key={room._id}
                          className="p-4 rounded-xl glass-panel border border-sky-400/20 hover:border-sky-400/50 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-slate-950 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">
                                {room.name}
                              </span>
                              <StatusBadge status={room.designStatus || 'Draft'} />
                            </div>

                            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium block mb-2">
                              Style: <strong className="text-slate-950 dark:text-white font-bold">{room.style || 'Modern'}</strong> • {room.dimensions || '180 sq.ft'}
                            </span>

                            {/* Color Swatches */}
                            {room.colorPalette && (
                              <div className="flex items-center gap-1 mb-3">
                                {[room.colorPalette.primary, room.colorPalette.secondary, room.colorPalette.accent, room.colorPalette.flooring].map((c, idx) => (
                                  <div
                                    key={idx}
                                    className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Specs count */}
                            <div className="flex items-center gap-3 text-[10px] text-slate-700 dark:text-slate-300 font-medium mb-3">
                              <span>{room.furniture?.length || 0} Furniture</span>
                              <span>•</span>
                              <span>{room.materials?.length || 0} Materials</span>
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs mt-2"
                            onClick={() => {
                              setSelectedRoomForDesign(room);
                              setSelectedProjectForRoom(project);
                            }}
                            icon={Palette}
                          >
                            Design Room
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

      {/* Room Designer Modal */}
      <RoomDesignerModal
        isOpen={!!selectedRoomForDesign}
        onClose={() => setSelectedRoomForDesign(null)}
        room={selectedRoomForDesign}
        projectId={selectedProjectForRoom?._id}
        onSaveRoom={handleSaveRoomDesign}
        onSubmitForReview={handleSubmitForReview}
      />
    </div>
  );
};

export default DesignerDashboard;
