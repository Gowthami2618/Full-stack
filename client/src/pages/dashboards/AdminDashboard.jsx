import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  ShieldCheck,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { analyticsAPI, usersAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  const [analytics, setAnalytics] = useState(null);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes] = await Promise.all([
        analyticsAPI.getAdmin(),
        usersAPI.getUsers({ isVerified: 'false', limit: 5 }),
      ]);

      setAnalytics(analyticsRes.data?.data || null);
      setUnverifiedUsers(usersRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (userId, name) => {
    try {
      await usersAPI.verifyUser(userId);
      showToast(`${name} has been verified successfully!`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to verify user', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Compiling platform governance data..." />;
  }

  const summary = analytics?.summary || {};
  const charts = analytics?.charts || {};

  const PIE_COLORS = ['#38BDF8', '#0284C7', '#64748B', '#10B981'];

  const tooltipStyle = {
    backgroundColor: isDark ? '#0F1F33' : '#FFFFFF',
    borderColor: 'rgba(56,189,248,0.3)',
    borderRadius: '12px',
    color: isDark ? '#F8FAFC' : '#0F172A',
    fontSize: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
              Platform Command Center
            </span>
            <Badge variant="sky" size="sm">
              Administrator
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
            Platform Intelligence & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-xl mt-1 font-medium">
            Global view of user registrations, professional certifications, system throughput, and architectural fit-out budgets.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button
            variant="glass"
            size="md"
            onClick={() => navigate('/admin/users')}
            icon={Users}
          >
            Manage Users
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/admin/audit-logs')}
            icon={ShieldCheck}
          >
            Audit Logs
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={summary.totalUsers || 0}
          subtitle={`${summary.clientsCount || 0} Clients • ${summary.designersCount || 0} Designers`}
          icon={Users}
          variant="sky"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Global Projects"
          value={summary.totalProjects || 0}
          subtitle={`${summary.activeProjects || 0} Active • ${summary.completedProjects || 0} Completed`}
          icon={FolderKanban}
          variant="sky"
          onClick={() => navigate('/admin/projects')}
        />
        <StatCard
          title="Committed Platform Budget"
          value={`$${(summary.totalBudget || 0).toLocaleString()}`}
          subtitle={`$${(summary.totalSpent || 0).toLocaleString()} incurred`}
          icon={DollarSign}
          variant="emerald"
        />
        <StatCard
          title="Pending Verifications"
          value={summary.pendingVerifications || 0}
          subtitle="Professionals awaiting review"
          icon={Award}
          variant="rose"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Distribution */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white">
              Users Ecosystem by Role
            </h3>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Platform Demographics</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.usersByRole || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(charts.usersByRole || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Projects Status Distribution */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white">
              Projects by Lifecycle Status
            </h3>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Workflow Volume</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.projectsByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis
                  dataKey="status"
                  stroke={isDark ? '#CBD5E1' : '#334155'}
                  fontSize={10}
                  tickFormatter={(val) => val.substring(0, 8)}
                />
                <YAxis stroke={isDark ? '#CBD5E1' : '#334155'} fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Pending Professional Verifications Queue */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white">
              Pending Professional Verifications ({unverifiedUsers.length})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/users')}
            icon={ArrowRight}
          >
            All Users
          </Button>
        </div>

        {unverifiedUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-xl font-bold">
            ✓ All registered designers and contractors have been verified.
          </div>
        ) : (
          <div className="divide-y divide-slate-200/50 dark:divide-white/5">
            {unverifiedUsers.map((u) => (
              <div
                key={u._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={u.profileImage} name={u.name} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-950 dark:text-white">{u.name}</span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{u.email}</span>
                  </div>
                  <Badge variant={u.role === 'DESIGNER' ? 'sky' : 'default'} size="sm">
                    {u.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleVerify(u._id, u.name)}
                    icon={CheckCircle2}
                  >
                    Grant Verification
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
