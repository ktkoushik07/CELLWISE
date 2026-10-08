import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Recycle,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Server,
  Wrench,
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Header Navigation */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-40 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">The Challenge</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#pathways" className="hover:text-cyan-400 transition-colors">Pathways</a>
          <a href="#portals" className="hover:text-cyan-400 transition-colors">Ecosystem Portals</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portals')}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-semibold border border-slate-700 transition-all"
          >
            Portal Directory
          </button>
          <button
            onClick={() => navigate('/login/refurbisher')}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-1.5"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative pt-16 pb-24 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-glow" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <ShieldCheck className="w-4 h-4" /> EV Battery Circularity Decision Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Give Every EV Battery a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Smarter Next Life.</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              CELLWISE evaluates used EV batteries and helps identify whether they should be reused, given a second life, tested further, or recycled.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm transition-all shadow-xl shadow-cyan-950/60 flex items-center gap-2"
              >
                Explore CELLWISE <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-semibold text-sm border border-slate-800 transition-all flex items-center gap-2"
              >
                See How It Works
              </a>
            </div>

            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 font-mono">
              <div>
                <div className="text-2xl font-extrabold text-white">4 Pathways</div>
                <div className="text-xs text-slate-400">Reuse, 2nd-Life, Testing, Recycle</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-cyan-400">100%</div>
                <div className="text-xs text-slate-400">Transparent Rule Engine</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-400">3 Portals</div>
                <div className="text-xs text-slate-400">Refurbisher, Provider, Recycler</div>
              </div>
            </div>
          </div>

          {/* Hero Visual: Interactive Battery Circularity Concept */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative font-mono">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>Decision Flow Architecture</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> LIVE PREVIEW
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-800 rounded text-cyan-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">EVB-2048 (LFP)</div>
                    <div className="text-[10px] text-slate-500">Model 3 Drivetrain • 40 Ah Rated</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Raw Record</span>
              </div>

              <div className="text-center text-slate-600">↓ Diagnostic Input</div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[10px]">MEASURED CAPACITY</div>
                  <div className="text-sm font-bold text-white">29 Ah (72.5% SoH)</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">THERMAL ΔT</div>
                  <div className="text-sm font-bold text-emerald-400">+2.8 °C (Normal)</div>
                </div>
              </div>

              <div className="text-center text-slate-600">↓ CELLWISE Circularity Engine</div>

              <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-cyan-500/40 text-center shadow-lg">
                <div className="text-[10px] text-slate-400 tracking-widest uppercase">Circularity Score</div>
                <div className="text-4xl font-extrabold text-cyan-400 my-1">76 / 100</div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold uppercase mt-1">
                  SECOND-LIFE CANDIDATE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id="problem" className="py-20 px-6 lg:px-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">The Industrial Problem</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Millions of EV Batteries Are Retired Without Clear Circularity Pathways
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              As EV adoption accelerates, millions of battery packs reach 70-80% remaining capacity. Currently, many are prematurely recycled or discarded due to fragmented testing and lack of decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
              <div className="p-3 bg-rose-950/50 text-rose-400 w-fit rounded-lg border border-rose-900">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Premature Scrap Risk</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Packs with over 70% capacity are sent to shredders because service centers lack fast, standardized circularity evaluation models.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
              <div className="p-3 bg-amber-950/50 text-amber-400 w-fit rounded-lg border border-amber-900">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Siloed Data Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Refurbishers, stationary storage builders, and material recyclers operate in isolated silos without shared battery passports.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
              <div className="p-3 bg-cyan-950/50 text-cyan-400 w-fit rounded-lg border border-cyan-900">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Opaque Decision Metrics</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Organizations rely on subjective gut feel or black-box predictions instead of transparent, verifiable engineering scoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW CELLWISE WORKS */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Workflow Architecture</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            End-to-End Battery Circularity Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          {[
            { step: '01', title: 'Battery Record Creation', desc: 'Capture chemistry, serial, EV model, & manufacturing metadata.' },
            { step: '02', title: 'Empirical Assessment', desc: 'Record measured capacity, internal resistance, voltage drop, & thermal rise.' },
            { step: '03', title: 'Circularity Score', desc: 'Transparent weighted engine calculates 0-100 Circularity Score.' },
            { step: '04', title: 'Pathway Recommendation', desc: 'Automatically route to Reuse, Second-Life, Testing, or Recycling.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-800 relative group hover:border-cyan-500/50 transition-all">
              <div className="text-2xl font-extrabold text-cyan-500 mb-2">{item.step}</div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: CIRCULARITY PATHWAYS */}
      <section id="pathways" className="py-20 px-6 lg:px-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">The 4 Pathways</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Optimized Next-Life Destination Classification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
            <div className="bg-slate-950 p-6 rounded-xl border border-emerald-900/50 space-y-3">
              <div className="px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold w-fit">
                1. REUSE
              </div>
              <h3 className="text-base font-bold text-white">Direct EV Remanufacturing</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                High score (≥80), low IR, normal thermal state. Suitable for secondary EV vehicle pack integration.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-amber-900/50 space-y-3">
              <div className="px-3 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold w-fit">
                2. SECOND-LIFE
              </div>
              <h3 className="text-base font-bold text-white">Stationary Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Moderate score (65-79), stable thermal profile. Ideal for grid storage, solar backup, & UPS units.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-sky-900/50 space-y-3">
              <div className="px-3 py-1 rounded bg-sky-950 text-sky-400 border border-sky-800 text-xs font-bold w-fit">
                3. FURTHER TESTING
              </div>
              <h3 className="text-base font-bold text-white">Laboratory Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Borderline parameters or high variance. Placed in advanced impedance & EIS testing queue.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-rose-900/50 space-y-3">
              <div className="px-3 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold w-fit">
                4. RECYCLING
              </div>
              <h3 className="text-base font-bold text-white">Material Recovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Degraded capacity (&lt;50%) or thermal anomalies. Sent to hydrometallurgical recycling for Cobalt/Lithium recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PLATFORM ROLES */}
      <section id="portals" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Multi-Tenant Ecosystem</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Three Dedicated Portals for Key Industry Stakeholders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-cyan-950 text-cyan-400 w-fit rounded-xl border border-cyan-800">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Phase 01: Refurbisher Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Create battery records, input physical & thermal test data, generate Circularity Scores, & respond to Second-Life requests.
              </p>
            </div>
            <button
              onClick={() => navigate('/login/refurbisher')}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Refurbisher Portal Sign In <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-amber-950 text-amber-400 w-fit rounded-xl border border-amber-800">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Phase 02: Second-Life Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Browse eligible candidate batteries, evaluate application compatibility (Solar, UPS, Storage), & submit battery requests.
              </p>
            </div>
            <button
              onClick={() => navigate('/login/secondlife')}
              className="w-full py-2.5 bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Second-Life Portal Sign In <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-rose-950 text-rose-400 w-fit rounded-xl border border-rose-800">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Phase 03: Recycler Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                View queued recycling candidates, track collection & material extraction workflow status, & audit material recovery volumes.
              </p>
            </div>
            <button
              onClick={() => navigate('/login/recycler')}
              className="w-full py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Recycler Portal Sign In <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: BATTERY LIFECYCLE CONCEPT */}
      <section className="py-20 px-6 lg:px-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Complete Chain of Custody</span>
          <h2 className="text-3xl font-extrabold text-white">Digital Battery Passport & Traceability</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Every battery assessed on CELLWISE generates a permanent Digital Battery Passport with unique QR code verification and complete milestone chain of custody.
          </p>
        </div>
      </section>

      {/* SECTION 7: KEY FEATURES */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Industrial Battery Circularity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="font-bold text-white mb-1">Transparent Formula</h4>
            <p className="text-slate-400 font-sans">No black box predictions. Fully configurable weighted scoring model based on capacity, electrical, thermal, and usage parameters.</p>
          </div>

          <div className="p-5 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-white mb-1">Real-Time Shared Data</h4>
            <p className="text-slate-400 font-sans">Refurbisher creations immediately appear in Second-Life inventory and Recycler queues with live cross-portal sync.</p>
          </div>

          <div className="p-5 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-white mb-1">PDF Assessment Reports</h4>
            <p className="text-slate-400 font-sans">Generate and print audit-ready assessment documents with preliminary decision support disclaimers and technician signatures.</p>
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-extrabold text-white">Ready to Evaluate EV Battery Circularity?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Test the complete end-to-end decision workflow across all three user portals using pre-configured demo credentials.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-base transition-all shadow-xl shadow-cyan-950/60 inline-flex items-center gap-2"
          >
            Launch CELLWISE Platform <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* SECTION 9: FOOTER */}
      <footer className="py-12 px-6 lg:px-12 border-t border-slate-800 text-slate-500 font-mono text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo size="sm" showSubtitle={true} />
        <div>CELLWISE Engineering Competition Prototype • Preliminary Decision-Support System</div>
        <div className="text-[11px] text-slate-600">
          Does not replace formal UN 38.3 high-voltage safety certification.
        </div>
      </footer>
    </div>
  );
};
