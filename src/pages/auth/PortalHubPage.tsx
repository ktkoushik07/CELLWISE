import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Server, Recycle, ShieldCheck, ArrowRight, Sparkles, Activity, Layers, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { authService, DEMO_USERS } from '../../services/auth';
import type { UserRole } from '../../types/battery';

interface PortalCard {
  role: UserRole;
  slug: string;
  phase: string;
  title: string;
  subTitle: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  borderAccent: string;
  bgGradient: string;
  btnBg: string;
  userEmail: string;
  features: string[];
}

const PORTALS: PortalCard[] = [
  {
    role: 'refurbisher',
    slug: 'refurbisher',
    phase: 'PHASE 01 — DIAGNOSTIC INTAKE',
    title: 'Refurbisher & EV Service Centre Portal',
    subTitle: 'Diagnostic Intake & Circularity Scoring',
    description: 'Perform diagnostic assessments on incoming used EV battery packs, run automated multi-factor circularity scoring, and assign next-life circularity pathways.',
    icon: Wrench,
    accent: 'text-cyan-400',
    borderAccent: 'border-cyan-500/40 hover:border-cyan-400',
    bgGradient: 'from-cyan-950/20 via-slate-900 to-slate-950',
    btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50',
    userEmail: 'refurbisher@cellwise.demo',
    features: [
      'Diagnostic intake form for SOH, capacity & thermal stability',
      'Automated 0-100 circularity scoring algorithm with rationale',
      'Printable PDF audit report & QR passport generation'
    ]
  },
  {
    role: 'second_life',
    slug: 'secondlife',
    phase: 'PHASE 02 — BESS INTEGRATION',
    title: 'Second-Life Provider Portal',
    subTitle: 'Re-Use Allocation & BESS Procurement',
    description: 'Explore certified pre-owned EV battery modules ready for second-life application in stationary energy storage (BESS), solar buffers, and microgrid backup.',
    icon: Server,
    accent: 'text-amber-400',
    borderAccent: 'border-amber-500/40 hover:border-amber-400',
    bgGradient: 'from-amber-950/20 via-slate-900 to-slate-950',
    btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50',
    userEmail: 'secondlife@cellwise.demo',
    features: [
      'Certified second-life inventory catalog search',
      'Application suitability matching engine (BESS, Solar, UPS)',
      'Multi-module allocation request & tracking workflow'
    ]
  },
  {
    role: 'recycler',
    slug: 'recycler',
    phase: 'PHASE 03 — MATERIAL RECOVERY',
    title: 'Battery Recycler Portal',
    subTitle: 'EOL Deactivation & Hydrometallurgy',
    description: 'Track hazardous end-of-life battery queues, record step-by-step 6-stage hydrometallurgical recycling operations, and audit recovered raw metal yields.',
    icon: Recycle,
    accent: 'text-rose-400',
    borderAccent: 'border-rose-500/40 hover:border-rose-400',
    bgGradient: 'from-rose-950/20 via-slate-900 to-slate-950',
    btnBg: 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-950/50',
    userEmail: 'recycler@cellwise.demo',
    features: [
      'Deactivation & discharge queue management',
      '6-Stage hydrometallurgical extraction pipeline tracker',
      'Critical raw materials yield audit (Lithium, Nickel, Cobalt)'
    ]
  },
  {
    role: 'admin',
    slug: 'admin',
    phase: 'PHASE 04 — ENTERPRISE GOVERNANCE',
    title: 'Enterprise Admin Portal',
    subTitle: 'System-Wide Governance & Regulatory Audit',
    description: 'Monitor cross-portal circularity metrics, manage user role permissions, audit immutable system logs, and verify compliance against EU Battery Directives.',
    icon: ShieldCheck,
    accent: 'text-purple-400',
    borderAccent: 'border-purple-500/40 hover:border-purple-400',
    bgGradient: 'from-purple-950/20 via-slate-900 to-slate-950',
    btnBg: 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-purple-950/50',
    userEmail: 'admin@cellwise.demo',
    features: [
      'Cross-portal ecosystem telemetry dashboard',
      'Role-based access control & user administration',
      'System-wide audit trail & database export tools'
    ]
  }
];

export const PortalHubPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickLogin = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (found) {
      const { user } = authService.login(found.email, found.password);
      if (user) {
        navigate(authService.getRoleDefaultRoute(user.role));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between p-4 lg:p-12">
      {/* HEADER */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-slate-800/80 pb-6">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </Link>
        </div>
      </div>

      {/* MAIN HERO & PORTAL DIRECTORY GRID */}
      <div className="w-full max-w-6xl mx-auto my-10 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>CELLWISE PORTAL DIRECTORY</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Select Phase Access Portal
          </h1>
          <p className="text-sm text-slate-400 font-mono leading-relaxed">
            CELLWISE features 4 independent specialized portals for each phase of the battery circularity lifecycle. Choose your operational phase to enter the dedicated login interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.slug}
                className={`bg-gradient-to-br ${portal.bgGradient} border ${portal.borderAccent} rounded-2xl p-6 lg:p-8 transition-all duration-300 shadow-xl flex flex-col justify-between group relative overflow-hidden`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {portal.phase}
                    </span>
                    <Icon className={`w-7 h-7 ${portal.accent} transform group-hover:scale-110 transition-transform`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {portal.title}
                    </h3>
                    <p className={`text-xs font-mono font-bold ${portal.accent} mt-0.5`}>
                      {portal.subTitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {portal.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
                    {portal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Activity className={`w-3 h-3 ${portal.accent} shrink-0`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <Link
                    to={`/login/${portal.slug}`}
                    className={`flex-1 py-3 text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-2 ${portal.btnBg}`}
                  >
                    Dedicated Sign In <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin(portal.role)}
                    title="Instant Demo Login"
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-6xl mx-auto border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <div>CELLWISE EV Battery Circularity Platform &bull; Engineering Competition Prototype</div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Refurbisher Portal</span> &bull; 
          <span>Second-Life Portal</span> &bull; 
          <span>Recycler Portal</span> &bull; 
          <span>Admin Portal</span>
        </div>
      </div>
    </div>
  );
};
