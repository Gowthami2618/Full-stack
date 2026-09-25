import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Hammer,
  CheckCircle2,
} from 'lucide-react';
import { WarpFieldBackground } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        {/* ThreeUI Hyperspace WarpField Background */}
        <div className="shader-frame absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl opacity-80">
          <WarpFieldBackground
            variant="hyperspace"
            speed={15.0}
            streakOpacity={0.60}
            tileOpacity={0.90}
            fov={75}
            hue={0}
            saturation={1.00}
            brightness={1.00}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-transparent to-[var(--bg-primary)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,var(--bg-primary)_100%)] pointer-events-none opacity-80" />
        </div>

        {/* Hero Content positioned cleanly above the background */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Glow ambient background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-600 dark:text-sky-300 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            The Premier Architectural Interior Collaboration Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-slate-950 dark:text-white max-w-4xl tracking-tight leading-[1.1] mb-6 drop-shadow-xs">
            Design Your Space.{' '}
            <span className="sky-gradient-text block mt-1">Manage Every Detail.</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-800 dark:text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Connect discerning clients, visionary interior designers, and master contractors
            on a unified platform. Streamline proposals, revisions, budgets, materials, and execution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={ArrowRight}
            >
              Start Your Project
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Platform
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Quick Sign In
            </Button>
          </div>

          {/* Hero Graphic Showcase */}
          <div className="mt-16 w-full max-w-5xl rounded-2xl glass-panel p-2.5 sm:p-4 border-sky-400/25 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Interior Design Architecture"
              className="w-full h-72 sm:h-[480px] object-cover rounded-xl"
            />
            <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 glass-dropdown p-4 sm:p-6 rounded-xl border-sky-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col text-left">
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                  Live Project Showcase
                </span>
                <h3 className="text-base sm:text-xl font-serif font-bold text-slate-950 dark:text-white">
                  Tribeca High-Ceiling Loft Renovation
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium hidden sm:block">
                  Client: Eleanor Vance • Designer: Aurelia Dupont • Contractor: Harrison Sterling
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="sky">IN PROGRESS (45%)</Badge>
                <Badge variant="emerald">$125,000 Budget</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Spectrum Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            Tailored Workspaces
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white mt-2">
            Built Specifically for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-3">
            Role-based interfaces crafted with precision tools for clients, designers, and contractors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Card */}
          <GlassCard className="flex flex-col justify-between border-sky-400/25">
            <div>
              <div className="p-3 w-fit rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30 mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white mb-2">For Clients</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
                Publish dream vision projects, browse verified designers, review and approve rich design concepts, request revisions, and monitor progress live.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Instant project creation & budget targets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Interactive proposal review & revision tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Transparent expense & milestone timelines
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-8"
              onClick={() => navigate('/register')}
            >
              Sign Up as Client
            </Button>
          </GlassCard>

          {/* Designer Card */}
          <GlassCard className="flex flex-col justify-between border-sky-400/25">
            <div>
              <div className="p-3 w-fit rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white mb-2">For Designers</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
                Craft comprehensive design concepts with sample boards, material estimations, and cost projections. Manage client feedback in an integrated revision loop.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Visual design proposals & 3D render uploads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Structured revision requests & change logs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Collaborative task assignment for builders
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-8"
              onClick={() => navigate('/register')}
            >
              Sign Up as Designer
            </Button>
          </GlassCard>

          {/* Contractor Card */}
          <GlassCard className="flex flex-col justify-between border-sky-400/25">
            <div>
              <div className="p-3 w-fit rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30 mb-6">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white mb-2">For Contractors</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
                Execute projects on time and budget. Track material orders, log phase milestones, record job-site expenses with receipts, and communicate on tasks.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Material procurement lifecycle & logistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Real-time task boards & progress updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  Automated budget depletion calculations
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-8"
              onClick={() => navigate('/register')}
            >
              Sign Up as Contractor
            </Button>
          </GlassCard>
        </div>
      </section>

      {/* Complete Workflow Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <GlassCard className="p-8 sm:p-12 border-sky-400/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
              End-to-End Execution
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 dark:text-white mt-2">
              The DesignSpace Project Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">
              From initial room aspiration to final white-glove handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="p-5 rounded-xl glass-panel border border-sky-400/15 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">01 / BRIEF</span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">Project Brief</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Client registers space dimensions, aesthetic preferences, budget ceiling, and room photos.
              </p>
            </div>

            <div className="p-5 rounded-xl glass-panel border border-sky-400/15 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">02 / PROPOSAL</span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">Design Concept</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Designer crafts high-fidelity concept proposals, estimated duration, and material schedules.
              </p>
            </div>

            <div className="p-5 rounded-xl glass-panel border border-sky-400/15 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">03 / SIGN-OFF</span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">Client Approval</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Client reviews proposal, requests revisions, or signs off to unlock execution phase.
              </p>
            </div>

            <div className="p-5 rounded-xl glass-panel border border-sky-400/15 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">04 / FIT-OUT</span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white">Bespoke Build</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Contractors track material orders, milestone progress, and site tasks until completion.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="rounded-3xl glass-panel p-10 sm:p-16 border-sky-400/30 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-950 dark:text-white mb-4">
            Ready to Elevate Your Interior Projects?
          </h2>
          <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
            Join hundreds of clients, designers, and contracting teams managing exceptional luxury spaces on DesignSpace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={ArrowRight}
            >
              Create Free Account
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In to Existing Workspace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
