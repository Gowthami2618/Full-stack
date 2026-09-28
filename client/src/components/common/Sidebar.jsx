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
          className="fixed inset-0 bg-slate-950/70 dark:bg-navy-950/85 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 glass-panel border-r border-aqua-400/25 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 pt-20 lg:pt-6 bg-white/95 dark:bg-teal-900/95 backdrop-blur-2xl shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 px-4">
          {/* User Workspace Info Pill */}
          <div className="p-3.5 rounded-xl bg-aqua-50/80 dark:bg-teal-800/90 border border-aqua-400/30 flex items-center justify-between shadow-xs">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#58737D] dark:text-[#A8D0D5] uppercase tracking-wider font-extrabold">
                Workspace Mode
              </span>
              <span className="text-xs font-bold text-[#173B4A] dark:text-[#F3FFFF] mt-0.5">
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
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#58737D] dark:text-[#A8D0D5] px-3 mb-1">
              Main Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 group ${
                      isActive
                        ? item.highlight
                          ? 'aqua-gradient-btn text-white font-bold shadow-md'
                          : 'bg-aqua-500/20 text-aqua-800 dark:text-[#5DE0EA] border border-aqua-400/50 font-bold shadow-xs'
                        : item.highlight
                        ? 'bg-aqua-500/15 text-aqua-800 dark:text-[#5DE0EA] hover:bg-aqua-500/25 border border-aqua-400/35 font-bold'
                        : 'text-[#173B4A] dark:text-[#D3F2F4] hover:text-[#139BC5] dark:hover:text-white hover:bg-aqua-500/15'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-aqua-600 dark:text-[#5DE0EA]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-aqua-400/20 flex items-center justify-between text-[11px] text-[#58737D] dark:text-[#A8D0D5] bg-aqua-50/40 dark:bg-teal-950/40">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-aqua-600 dark:text-[#5DE0EA]" />
            <span className="font-bold text-[#173B4A] dark:text-[#F3FFFF]">DesignSpace v2.4</span>
          </div>
          <span className="text-[10px] bg-aqua-500/20 px-2 py-0.5 rounded-md border border-aqua-400/35 text-aqua-800 dark:text-[#5DE0EA] font-extrabold">
            Enterprise
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
