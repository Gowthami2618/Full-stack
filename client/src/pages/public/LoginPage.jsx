import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (activeUser) => {
    const from = location.state?.from?.pathname;
    if (from && !['/login', '/register', '/unauthorized'].includes(from)) {
      navigate(from, { replace: true });
      return;
    }
    if (activeUser?.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
    else if (activeUser?.role === 'DESIGNER') navigate('/designer/dashboard', { replace: true });
    else if (activeUser?.role === 'CONTRACTOR') navigate('/contractor/dashboard', { replace: true });
    else navigate('/client/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      redirectAfterLogin(res.user);
    } else {
      setError(res.message);
    }
  };

  // Quick Demo Login helper
  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setIsLoading(true);
    setError('');
    const res = await login(demoEmail, 'Password123!');
    setIsLoading(false);
    if (res.success) {
      redirectAfterLogin(res.user);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <GlassCard className="border-sky-400/25 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-400/20 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5">
              Sign in to your interior design workspace
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              icon={LogIn}
              className="mt-2 w-full"
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-sky-400/15">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Instant Demo Exploration</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@designspace.com')}
                className="text-[11px] p-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-sky-500/10 dark:hover:bg-charcoal-700 hover:border-sky-400/40 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 transition-all text-left font-bold"
              >
                👑 Admin Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('client@designspace.com')}
                className="text-[11px] p-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-sky-500/10 dark:hover:bg-charcoal-700 hover:border-sky-400/40 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 transition-all text-left font-bold"
              >
                👤 Client Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('designer@designspace.com')}
                className="text-[11px] p-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-sky-500/10 dark:hover:bg-charcoal-700 hover:border-sky-400/40 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 transition-all text-left font-bold"
              >
                🎨 Designer Studio
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('contractor@designspace.com')}
                className="text-[11px] p-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-sky-500/10 dark:hover:bg-charcoal-700 hover:border-sky-400/40 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 transition-all text-left font-bold"
              >
                🔨 Contractor Desk
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-sky-600 dark:text-sky-400 hover:underline font-bold">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;
