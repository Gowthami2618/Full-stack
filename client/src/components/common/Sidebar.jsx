import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  // Role-based navigation item lists
  const navConfigs = {
    CLIENT: [
      {
        label: 'Dashboard',
        to: '/client/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'My Projects',
        to: '/projects',
        icon: FolderKanban,
      },
      {
        label: 'Create Project',
        to: '/client/projects/new',
        icon: PlusCircle,
        highlight: true,
      },
      {
        label: 'Find Professionals',
        to: '/professionals',
        icon: Users,
      },
    ],
    DESIGNER: [
      {
        label: 'Studio Dashboard',
        to: '/designer/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Design Projects',
        to: '/projects',
        icon: FolderKanban,
      },
      {
        label: 'Professionals Network',
        to: '/professionals',
        icon: Users,
      },
    ],
    CONTRACTOR: [
      {
        label: 'Execution Hub',
        to: '/contractor/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Fit-out Projects',
        to: '/projects',
        icon: FolderKanban,
      },
      {
        label: 'Network',
        to: '/professionals',
        icon: Users,
      },
    ],
    ADMIN: [
      {
        label: 'Command Center',
        to: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'User Directory',
        to: '/admin/users',
        icon: Users,
      },
      {
        label: 'All Projects',
        to: '/admin/projects',
        icon: FolderKanban,
      },
      {
        label: 'Audit & Compliance',
        to: '/admin/audit-logs',
        icon: ShieldCheck,
      },
    ],
  };

  const navItems = navConfigs[user.role] || navConfigs.CLIENT;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 glass-panel border-r border-sky-400/20 bg-charcoal-950/95 lg:bg-charcoal-950/80 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 pt-20 lg:pt-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 px-4">
          {/* User Workspace Info Pill */}
          <div className="p-3.5 rounded-xl bg-charcoal-900/80 border border-sky-400/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Workspace Mode
              </span>
              <span className="text-xs font-semibold text-slate-100 mt-0.5">
                {user.role === 'ADMIN'
                  ? 'Governance'
                  : user.role === 'DESIGNER'
                  ? 'Creative Studio'
                  : user.role === 'CONTRACTOR'
                  ? 'Construction Desk'
                  : 'Client Portal'}
              </span>
            </div>
            {user.isVerified && (
              <Badge variant="sky" size="sm">
                Verified
              </Badge>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400/70 px-3 mb-1">
              Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? item.highlight
                          ? 'sky-gradient-btn text-white font-semibold shadow-lg'
                          : 'bg-sky-500/15 text-sky-300 border border-sky-400/30 font-semibold shadow-glass-subtle'
                        : item.highlight
                        ? 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-400/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-sky-500/[0.06]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sky-400/15 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>DesignSpace v2.4</span>
          </div>
          <span className="text-[10px] bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-400/20 text-sky-300">
            Enterprise
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
