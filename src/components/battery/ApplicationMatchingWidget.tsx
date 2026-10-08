import React from 'react';
import { Cpu, ShieldAlert, Zap, Sun, Server, ShieldCheck } from 'lucide-react';

interface ApplicationMatchingWidgetProps {
  compatibility?: {
    stationaryStorage: number;
    ups: number;
    solarStorage: number;
    backupPower: number;
  };
}

export const ApplicationMatchingWidget: React.FC<ApplicationMatchingWidgetProps> = ({
  compatibility = {
    stationaryStorage: 92,
    ups: 84,
    solarStorage: 88,
    backupPower: 80,
  },
}) => {
  const items = [
    {
      label: 'Stationary Grid Storage',
      pct: compatibility.stationaryStorage,
      icon: <Server className="w-4 h-4 text-cyan-400" />,
      desc: 'Ideal for peak-shaving & frequency regulation',
    },
    {
      label: 'UPS / Industrial Backup',
      pct: compatibility.ups,
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      desc: 'High rate discharge suitability',
    },
    {
      label: 'Solar Microgrid Storage',
      pct: compatibility.solarStorage,
      icon: <Sun className="w-4 h-4 text-emerald-400" />,
      desc: 'Daily cycle load shifting',
    },
    {
      label: 'Telecom & Standby Power',
      pct: compatibility.backupPower,
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      desc: 'Low C-rate emergency backup',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Prototype Application Compatibility
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Algorithm-derived suitability matching</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
          CELLWISE Rules Engine
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded border border-slate-700">{item.icon}</div>
                <div>
                  <div className="text-xs font-bold font-mono text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.desc}</div>
                </div>
              </div>
              <span className="text-base font-extrabold font-mono text-cyan-400">
                {item.pct}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.pct >= 85
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    : item.pct >= 70
                    ? 'bg-gradient-to-r from-amber-500 to-cyan-500'
                    : 'bg-slate-600'
                }`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-start gap-1.5 font-mono">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Note: Compatibility scores represent preliminary decision support and do not constitute certified engineering battery safety guarantees.
        </span>
      </div>
    </div>
  );
};
