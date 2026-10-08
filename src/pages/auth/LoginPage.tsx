import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Cpu, Recycle, Server, Wrench, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { authService } from '../../services/auth';
import type { UserRole } from '../../types/battery';

interface PhaseConfig {
  role: UserRole;
  slug: string;
  phaseNumber: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  highlights: string[];
  email: string;
  password: string;
}

const PHASES: Record<string, PhaseConfig> = {
  refurbisher: {
    role: 'refurbisher',
    slug: 'refurbisher',
    phaseNumber: 'PHASE 01',
    name: 'Refurbisher & Service Centre Portal',
    tagline: 'Standardized EV Battery Diagnostic Intake & Circularity Scoring',
    description: 'Perform standardized battery assessments, calculate multi-factor circularity scores, inspect automated decision pathways, and generate printable PDF compliance passports.',
    icon: Wrench,
    accentColor: 'text-cyan-400',
    bgGradient: 'from-cyan-950/30 via-slate-900 to-slate-950',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-400 border-cyan-800',
    buttonBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50',
    highlights: [
      'Real-Time Battery Diagnostic Intake & SOH Verification',
      'Automated 0-100 Multi-Factor Circularity Scoring Engine',
      'Direct Route Allocation to Reuse, Second-Life, or Recycling',
      'EU Battery Passport & Verification QR Code Generation'
    ],
    email: 'refurbisher@cellwise.demo',
    password: 'Refurb@123'
  },
  secondlife: {
    role: 'second_life',
    slug: 'secondlife',
    phaseNumber: 'PHASE 02',
    name: 'Second-Life Provider Portal',
    tagline: 'Stationary BESS Integration, Solar Buffering & Re-use Procurement',
    description: 'Browse certified pre-owned EV battery modules, match batteries with stationary energy storage systems (BESS), and track multi-module allocation requests.',
    icon: Server,
    accentColor: 'text-amber-400',
    bgGradient: 'from-amber-950/30 via-slate-900 to-slate-950',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-400 border-amber-800',
    buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50',
    highlights: [
      'Certified Second-Life Inventory Search & Compatibility Filter',
      'Application Suitability Index (Stationary BESS, UPS, Solar)',
      'Bulk Module Allocation Request & Order Management System',
      'Chain-of-Custody Module History & Performance Guarantee'
    ],
    email: 'secondlife@cellwise.demo',
    password: 'Second@123'
  },
  recycler: {
    role: 'recycler',
    slug: 'recycler',
    phaseNumber: 'PHASE 03',
    name: 'Battery Recycler & Extraction Portal',
    tagline: 'EOL Battery Deactivation, Black Mass Recovery & Hydrometallurgy',
    description: 'Manage incoming end-of-life battery queues, track 6-stage hydrometallurgical recycling operations, and audit recovered raw metal yields.',
    icon: Recycle,
    accentColor: 'text-rose-400',
    bgGradient: 'from-rose-950/30 via-slate-900 to-slate-950',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-950/80',
    badgeText: 'text-rose-400 border-rose-800',
    buttonBg: 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-950/50',
    highlights: [
      'Hazardous Material Logistics & Deactivation Queue Tracking',
      '6-Stage Hydrometallurgical Process Tracking Pipeline',
      'Extracted Metals Yield Audit (Li2CO3, NiSO4, CoSO4, MnSO4)',
      'Material Certificate of Recycling (CoR) Digital Generation'
    ],
    email: 'recycler@cellwise.demo',
    password: 'Recycler@123'
  },
  admin: {
    role: 'admin',
    slug: 'admin',
    phaseNumber: 'PHASE 04',
    name: 'Enterprise Admin & Governance Portal',
    tagline: 'System-Wide Monitoring, Regulatory Compliance & User Governance',
    description: 'Audit full platform activity, monitor battery allocation statistics, enforce access policies, and manage cross-portal database operations.',
    icon: ShieldCheck,
    accentColor: 'text-purple-400',
    bgGradient: 'from-purple-950/30 via-slate-900 to-slate-950',
    borderColor: 'border-purple-500/30',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-400 border-purple-800',
    buttonBg: 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-purple-950/50',
    highlights: [
      'System-Wide Circularity Metrics & Battery Stream Analytics',
      'Role-Based Access Control (RBAC) & User Management',
      'Immutable System Audit Logs & Diagnostic Verification',
      'Regulatory Compliance Export (EU Directive & ISO 14040)'
    ],
    email: 'admin@cellwise.demo',
    password: 'Admin@123'
  }
};

export const LoginPage: React.FC = () => {
  const { portalRole } = useParams<{ portalRole?: string }>();
  const navigate = useNavigate();

  // Normalize route param to one of key slugs (defaulting to refurbisher)
  const normalizedParam = portalRole ? portalRole.toLowerCase().replace(/[^a-z]/g, '') : '';
  const currentSlug = normalizedParam && PHASES[normalizedParam]
    ? normalizedParam
    : (portalRole === 'second-life' ? 'secondlife' : 'refurbisher');

  const [activeSlug, setActiveSlug] = useState<string>(currentSlug);
  const phase = PHASES[activeSlug] || PHASES.refurbisher;

  const [email, setEmail] = useState(phase.email);
  const [password, setPassword] = useState(phase.password);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let slug = 'refurbisher';
    if (portalRole) {
      const clean = portalRole.toLowerCase().replace(/[^a-z]/g, '');
      if (PHASES[clean]) {
        slug = clean;
      } else if (portalRole === 'second-life') {
        slug = 'secondlife';
      }
    }
    setActiveSlug(slug);
    setEmail(PHASES[slug].email);
    setPassword(PHASES[slug].password);
  }, [portalRole]);

  const handleSwitchPhase = (slug: string) => {
    setActiveSlug(slug);
    setEmail(PHASES[slug].email);
    setPassword(PHASES[slug].password);
    setError('');
    navigate(`/login/${slug}`);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const { user, error: loginErr } = authService.login(email, password);
      setIsLoading(false);

      if (loginErr) {
        setError(loginErr);
      } else if (user) {
        const targetRoute = authService.getRoleDefaultRoute(user.role);
        navigate(targetRoute);
      }
    }, 350);
  };

  const PhaseIcon = phase.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 lg:p-8 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* TOP PORTAL SELECTOR BAR */}
      <div className="w-full max-w-5xl mx-auto mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 font-mono">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>CELLWISE PORTAL GATEWAY</span>
          </div>
          <Link to="/portals" className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
            View All Portals Hub <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.values(PHASES).map((p) => {
            const Icon = p.icon;
            const isActive = p.slug === activeSlug;
            return (
              <button
                key={p.slug}
                onClick={() => handleSwitchPhase(p.slug)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isActive
                    ? `${p.badgeBg} ${p.borderColor} text-white font-bold shadow-lg`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${p.accentColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-mono leading-none mb-0.5">{p.phaseNumber}</div>
                  <div className="text-xs font-bold truncate leading-tight">{p.role.toUpperCase()}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DEDICATED PHASE LOGIN CARD */}
      <div className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* LEFT SIDE: PHASE-SPECIFIC FEATURE & BRANDING BANNER */}
        <div className={`lg:col-span-6 bg-gradient-to-br ${phase.bgGradient} p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <Logo size="md" />
              <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full border ${phase.badgeBg} ${phase.badgeText}`}>
                {phase.phaseNumber}
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <PhaseIcon className={`w-6 h-6 ${phase.accentColor}`} />
                <h2 className="text-2xl font-black text-white tracking-tight">{phase.name}</h2>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{phase.tagline}</p>
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">{phase.description}</p>
            </div>
          </div>

          {/* PHASE HIGHLIGHTS */}
          <div className="my-6 bg-slate-950/90 p-4 rounded-xl border border-slate-800/80 space-y-2 font-mono text-xs">
            <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${phase.accentColor}`}>
              <Cpu className="w-3.5 h-3.5" /> Portal Capabilities
            </div>
            <div className="space-y-1.5 pt-1">
              {phase.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${phase.accentColor}`} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 shrink-0 ${phase.accentColor}`} />
            <span>Official CELLWISE Portal Entry Point</span>
          </div>
        </div>

        {/* RIGHT SIDE: AUTHENTICATION FORM */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center justify-between mb-6 font-mono">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <PhaseIcon className={`w-5 h-5 ${phase.accentColor}`} /> Sign In to {phase.role.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Dedicated access portal for authorized personnel</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Portal Username / Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={phase.email}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0" />
                  <span>Remember Session</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(`Credentials for ${phase.name}:\nEmail: ${phase.email}\nPassword: ${phase.password}`)}
                  className={`${phase.accentColor} hover:underline`}
                >
                  Show Password
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${phase.buttonBg}`}
              >
                {isLoading ? (
                  <span className="animate-pulse">Authenticating Portal Access...</span>
                ) : (
                  <>
                    Enter {phase.name} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* DIRECT DEMO FAST LAUNCH */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 font-mono">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>DEMO CREDENTIAL REPOSITORY</span>
              <span className="text-[10px] text-cyan-400">1-CLICK LOGIN</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 font-bold text-[11px] block">{phase.email}</span>
                <span className="text-[10px] text-slate-500">Pass: {phase.password}</span>
              </div>
              <button
                type="button"
                onClick={() => handleLogin()}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${phase.buttonBg}`}
              >
                Instant Access
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 font-mono mt-6">
        CELLWISE EV Battery Circularity Platform &copy; 2026 &bull; Engineering Competition Prototype
      </div>
    </div>
  );
};
