import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import Avatar from './Avatar';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch recent notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationsAPI.getNotifications({ limit: 5 });
      if (res.data?.data) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-sky-400/20 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-sky-500/10 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-glass-glow">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors">
                Design<span className="text-sky-500 dark:text-sky-400">Space</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 -mt-1 font-medium">
                Atelier Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Theme Toggle, Notifications & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Theme Switcher Toggle Button */}
          <ThemeToggle size="md" />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl border border-sky-400/20 glass-panel text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:border-sky-400/40 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-dropdown border border-sky-400/25 shadow-2xl z-50 overflow-hidden animate-scaleUp">
                <div className="flex items-center justify-between p-4 border-b border-sky-400/15 bg-white/90 dark:bg-charcoal-900/90">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="sky" size="sm">
                        {unreadCount} New
                      </Badge>
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-sky-500 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    View all <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-200/50 dark:divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          if (n.relatedProject) {
                            navigate(`/projects/${n.relatedProject._id || n.relatedProject}`);
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-sky-500/[0.08] dark:hover:bg-sky-500/[0.05] transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                          !n.isRead ? 'bg-sky-500/[0.06] dark:bg-sky-500/[0.04]' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {n.title}
                            </span>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkRead(n._id, e)}
                            title="Mark as read"
                            className="text-slate-400 hover:text-emerald-500 p-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 sm:gap-3 p-1.5 pr-3 rounded-xl border border-sky-400/20 glass-panel hover:border-sky-400/40 transition-all text-left"
            >
              <Avatar src={user?.profileImage} name={user?.name} size="sm" />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-dropdown border border-sky-400/25 shadow-2xl z-50 overflow-hidden animate-scaleUp">
                <div className="p-4 border-b border-sky-400/15 bg-white/90 dark:bg-charcoal-900/90">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-2">
                    <Badge variant="sky" size="sm">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <div className="p-2 divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-sky-500/10 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
