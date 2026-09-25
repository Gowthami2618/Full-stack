import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (res.user?.role === 'DESIGNER') navigate('/designer/dashboard', { replace: true });
      else if (res.user?.role === 'CONTRACTOR') navigate('/contractor/dashboard', { replace: true });
      else navigate('/client/dashboard', { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <GlassCard className="border-sky-400/25 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-400/20 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5">
              Select your role to start collaborating on luxury interior spaces
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Selection Tabs */}
            <div className="flex flex-col gap-1.5 mb-1">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                I am registering as a:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'CLIENT', label: 'Client / Owner' },
                  { role: 'DESIGNER', label: 'Interior Designer' },
                  { role: 'CONTRACTOR', label: 'Contractor / Builder' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleSelect(item.role)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      formData.role === item.role
                        ? 'border-sky-500 bg-sky-500/15 text-sky-800 dark:text-sky-300 shadow-glass-subtle'
                        : 'border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-charcoal-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-sky-400/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Aurelia Dupont"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="At least 6 chars"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              icon={ArrowRight}
              className="mt-3 w-full"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-bold">
              Sign in instead
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RegisterPage;
