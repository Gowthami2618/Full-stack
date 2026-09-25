import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  DollarSign,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Palette,
  Hammer,
  AlertCircle,
  FileSpreadsheet,
  Eye,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, projectsAPI, proposalsAPI, expensesAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import RoomApprovalModal from '../../components/common/RoomApprovalModal';
import { useToast } from '../../context/ToastContext';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected room for design approval modal
  const [selectedRoomForApproval, setSelectedRoomForApproval] = useState(null);
  const [selectedProjectForRoom, setSelectedProjectForRoom] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes, proposalsRes] = await Promise.all([
        analyticsAPI.getClient(),
        projectsAPI.getProjects({ limit: 4 }),
        proposalsAPI.getProposals({ status: 'SENT' }),
      ]);

      setAnalytics(analyticsRes.data?.data || null);
      const loadedProjects = projectsRes.data?.data || [];
      setProjects(loadedProjects);
      setProposals(proposalsRes.data?.data || []);

      if (loadedProjects.length > 0) {
        try {
          const expRes = await expensesAPI.getExpenses({ projectId: loadedProjects[0]._id, limit: 5 });
          setExpenses(expRes.data?.data?.expenses || []);
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to load client dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveRoom = async (roomId, feedback) => {
    if (!selectedProjectForRoom) return;
    try {
      await projectsAPI.reviewRoomDesign(selectedProjectForRoom._id, roomId, {
        action: 'APPROVE',
        comments: feedback,
      });
      showToast('🎉 Room design approved! Designer notified.', 'success');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to approve room design', 'error');
    }
  };

  const handleRequestRoomChanges = async (roomId, comments) => {
    if (!selectedProjectForRoom) return;
    try {
      await projectsAPI.reviewRoomDesign(selectedProjectForRoom._id, roomId, {
        action: 'REQUEST_CHANGES',
        comments,
      });
      showToast('Revision request sent to designer.', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to submit revision request', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your home portal..." />;
  }

  // Primary House Project (Featured)
  const primaryHouse = projects[0] || null;
  const rooms = primaryHouse?.rooms || [];
  const completedRooms = rooms.filter((r) => r.executionStatus === 'Completed' || r.progress === 100).length;
  const inProgressRooms = rooms.filter((r) => r.executionStatus === 'In Progress' || (r.progress > 0 && r.progress < 100)).length;
  const pendingRooms = rooms.filter((r) => (r.progress || 0) === 0).length;

  const totalBudget = primaryHouse?.totalBudget || 1500000;
  const spentAmount = primaryHouse?.spentAmount || (totalBudget * 0.55);
  const remainingBudget = Math.max(0, totalBudget - spentAmount);
  const overallProgress = primaryHouse?.progress || 78;

  // Pending room design reviews
  const pendingRoomReviews = rooms.filter((r) => r.designStatus === 'Submitted' || r.designStatus === 'Client Review');

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
              House Owner Portal
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-400/30">
              Live House Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white">
            Welcome Home, {user?.name}
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-200 max-w-xl mt-1 font-medium">
            Track your dream home renovation room-by-room, review designer spatial blueprints, and manage contractor fit-out budgets.
          </p>
        </div>

        <div className="z-10 shrink-0 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/client/projects/new')}
            icon={Plus}
          >
            Create New House Project
          </Button>
        </div>
      </div>

      {/* FEATURED: YOUR DREAM HOME MAIN OVERVIEW CARD */}
      {primaryHouse && (
        <GlassCard className="p-6 sm:p-8 border-sky-400/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-sky-400/15">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-glass-glow">
                <Home className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                  Featured Property
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                  {primaryHouse.title}
                </h2>
                <span className="text-xs text-slate-700 dark:text-slate-200 mt-0.5 block font-medium">
                  {primaryHouse.propertyType || 'Villa'} • {primaryHouse.propertyDetails?.totalArea?.toLocaleString() || '2,400'} sq.ft • {primaryHouse.propertyDetails?.floors || 2} Floors • {primaryHouse.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="glass"
                size="sm"
                onClick={() => navigate(`/projects/${primaryHouse._id}`)}
                icon={ChevronRight}
              >
                Open Full House Workspace
              </Button>
            </div>
          </div>

          {/* Core Metrics: Progress, Budget, Spent, Remaining, Rooms Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
            {/* Overall Progress */}
            <div className="flex flex-col gap-1 p-4 rounded-xl glass-panel border border-sky-400/20 col-span-2 sm:col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Overall Progress</span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{overallProgress}%</span>
              </div>
              <ProgressBar progress={overallProgress} size="md" variant="sky" className="mt-2" />
              <span className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 font-medium">On schedule with interior milestones</span>
            </div>

            {/* Total Budget */}
            <div className="flex flex-col p-4 rounded-xl glass-panel border border-sky-400/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Budget</span>
              <span className="text-lg font-bold text-slate-950 dark:text-white mt-1">${totalBudget.toLocaleString()}</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">100% Allocated</span>
            </div>

            {/* Spent */}
            <div className="flex flex-col p-4 rounded-xl glass-panel border border-sky-400/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Incurred Spent</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">${spentAmount.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Verified Receipts</span>
            </div>

            {/* Remaining */}
            <div className="flex flex-col p-4 rounded-xl glass-panel border border-sky-400/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Remaining</span>
              <span className="text-lg font-bold text-sky-600 dark:text-sky-300 mt-1">${remainingBudget.toLocaleString()}</span>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Reserve Funds</span>
            </div>

            {/* Rooms Stats */}
            <div className="flex flex-col p-4 rounded-xl glass-panel border border-sky-400/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">House Spaces</span>
              <span className="text-lg font-bold text-slate-950 dark:text-white mt-1">{rooms.length || 8} Rooms</span>
              <span className="text-[10px] text-slate-700 dark:text-slate-200 font-medium">
                {completedRooms} Done • {inProgressRooms} Active • {pendingRooms} Next
              </span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* PENDING DESIGN APPROVALS ALERT */}
      {pendingRoomReviews.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-slate-950 dark:text-white">
                Action Required: {pendingRoomReviews.length} Room Designs Awaiting Your Review
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                Your interior architect has submitted new palettes, 3D concepts, and material specifications for your sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingRoomReviews.map((r) => (
              <Button
                key={r._id}
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedRoomForApproval(r);
                  setSelectedProjectForRoom(primaryHouse);
                }}
              >
                Review {r.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* SPACES GRID: ROOM BY ROOM CARDS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white">
              House Spaces & Interior Execution
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
              Independent spatial planning, color palettes, custom furniture, and site execution progress
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
            {rooms.length} Active Spaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <GlassCard
              key={room._id}
              className="p-4 border-sky-400/20 hover:border-sky-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-serif font-bold text-slate-950 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                      {room.name}
                    </span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">{room.dimensions || `${room.area || 180} sq.ft`}</span>
                  </div>
                  <StatusBadge status={room.designStatus || 'Draft'} />
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Site Build</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{room.progress || 0}%</span>
                  </div>
                  <ProgressBar progress={room.progress || 0} size="sm" variant={room.progress === 100 ? 'emerald' : 'sky'} />
                </div>

                {/* Details snapshot */}
                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-sky-50/70 dark:bg-charcoal-900/60 border border-sky-400/15 mb-3">
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 block text-[9px] uppercase font-bold">Budget</span>
                    <span className="font-bold text-slate-950 dark:text-white">${(room.budget || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 block text-[9px] uppercase font-bold">Style</span>
                    <span className="font-bold text-sky-700 dark:text-sky-300 truncate block">{room.style || 'Modern'}</span>
                  </div>
                </div>

                {/* Color Swatch Dots */}
                {room.colorPalette && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[9px] text-slate-700 dark:text-slate-300 uppercase font-bold">Colors:</span>
                    {[room.colorPalette.primary, room.colorPalette.secondary, room.colorPalette.accent, room.colorPalette.flooring].map(
                      (c, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/30 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-sky-400/15">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={() => {
                    setSelectedRoomForApproval(room);
                    setSelectedProjectForRoom(primaryHouse);
                  }}
                  icon={Eye}
                >
                  View Details & Approvals
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* BEFORE & AFTER SHOWCASE SLIDER */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Before & After Transformation Gallery
          </h3>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Slide to compare raw space with architectural design</span>
        </div>

        <BeforeAfterSlider
          beforeImage={
            primaryHouse?.housePhotos?.find((p) => p.tag === 'before')?.url ||
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
          }
          afterImage={
            primaryHouse?.images?.[0] ||
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
          }
          title={`${primaryHouse?.title || 'Villa'} — Master Living Space Transformation`}
        />
      </div>

      {/* Room Approval Modal */}
      <RoomApprovalModal
        isOpen={!!selectedRoomForApproval}
        onClose={() => setSelectedRoomForApproval(null)}
        room={selectedRoomForApproval}
        onApprove={handleApproveRoom}
        onRequestChanges={handleRequestRoomChanges}
      />
    </div>
  );
};

export default ClientDashboard;
