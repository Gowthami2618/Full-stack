import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

export const PublicLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DESIGNER') return '/designer/dashboard';
    if (user.role === 'CONTRACTOR') return '/contractor/dashboard';
    return '/client/dashboard';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-400 transition-colors duration-300">
      {/* Public Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-sky-400/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-glass-glow">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-[#173B4A] dark:text-[#F3FFFF] tracking-tight group-hover:text-aqua-600 dark:group-hover:text-[#5DE0EA] transition-colors">
                Design<span className="text-aqua-500 dark:text-[#5DE0EA]">Space</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#58737D] dark:text-[#A8D0D5] -mt-1 font-semibold">
                Atelier Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[#173B4A] dark:text-[#D3F2F4] font-bold">
            <a href="#features" className="hover:text-aqua-600 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-aqua-600 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#ecosystem" className="hover:text-aqua-600 dark:hover:text-white transition-colors">
              Ecosystem
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle size="md" />

            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(getDashboardPath())}
                icon={ArrowRight}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-aqua-400/20 glass-panel py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#58737D] dark:text-[#A8D0D5]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-aqua-500/20 text-aqua-600 dark:text-[#5DE0EA]">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-sm text-[#173B4A] dark:text-[#F3FFFF]">
              DesignSpace
            </span>
            <span>— Precision Interior Design & Project Execution</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-aqua-600 dark:hover:text-[#5DE0EA] transition-colors">
              Log In
            </Link>
            <Link to="/register" className="hover:text-aqua-600 dark:hover:text-[#5DE0EA] transition-colors">
              Register
            </Link>
            <ThemeToggle size="sm" />
            <span>© 2026 DesignSpace Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
