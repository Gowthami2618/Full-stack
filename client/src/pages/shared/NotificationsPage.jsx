import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getNotifications({ limit: 30 });
      if (res.data?.data) {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      showToast('All notifications marked as read', 'success');
      fetchNotifications();
    } catch (err) {
      showToast('Failed to update notifications', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      showToast('Failed to delete notification', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time updates on proposal approvals, task completions, and project milestones.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            icon={CheckCircle2}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are fully up to date! System alerts and project updates will appear here."
        />
      ) : (
        <div className="divide-y divide-sky-400/15 glass-card overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-sky-500/[0.08]' : 'hover:bg-sky-50/50 dark:hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.relatedProject && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(`/projects/${n.relatedProject._id || n.relatedProject}`)
                    }
                    icon={ExternalLink}
                  >
                    Workspace
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(n._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
