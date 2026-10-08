import React from 'react';
import { BatteryCharging, Cpu, Thermometer, ChevronRight } from 'lucide-react';
import type { Battery } from '../../types/battery';

interface BatteryCardProps {
  battery: Battery;
  onClick?: () => void;
  onRequestClick?: () => void;
  showRequestButton?: boolean;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({
  battery,
  onClick,
  onRequestClick,
  showRequestButton = false,
}) => {
  const retention = Number(
    ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
  );

  const badgeColors: Record<string, string> = {
    REUSE: 'bg-emerald-950/90 text-emerald-400 border-emerald-700',
    'SECOND-LIFE': 'bg-amber-950/90 text-amber-400 border-amber-700',
    'FURTHER TESTING': 'bg-sky-950/90 text-sky-400 border-sky-700',
    RECYCLING: 'bg-rose-950/90 text-rose-400 border-rose-700',
  };

  const latestAssessment = battery.assessments?.[0];

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between cursor-pointer overflow-hidden font-mono"
    >
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-800 via-cyan-500/40 to-slate-800 group-hover:via-cyan-400 transition-all" />

      <div>
        {/* Top Header: ID & Chemistry */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg text-cyan-400 border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                {battery.id}
              </h3>
              <p className="text-xs text-slate-400">
                {battery.manufacturer} • {battery.evModel}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {battery.chemistry}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                badgeColors[battery.latestRecommendation] || 'bg-slate-800 text-slate-300'
              }`}
            >
              {battery.latestRecommendation}
            </span>
          </div>
        </div>

        {/* Battery Capacity & Health Gauge Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono text-slate-400">Capacity Retention</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {retention}%{' '}
              <span className="text-xs text-slate-500 font-normal">
                ({battery.currentCapacityAh}/{battery.ratedCapacityAh} Ah)
              </span>
            </div>
            {/* Visual Capacity Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  retention >= 80
                    ? 'bg-emerald-500'
                    : retention >= 65
                    ? 'bg-amber-500'
                    : retention >= 50
                    ? 'bg-sky-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${retention}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400">Circularity Score</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {battery.latestScore} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-500" /> CELLWISE Algorithm
            </div>
          </div>
        </div>

        {/* Diagnostic Snapshot */}
        {latestAssessment && (
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1 pb-3 border-b border-slate-800/60">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-slate-500" />
              {latestAssessment.operatingTempC}°C (ΔT +{latestAssessment.tempRiseC}°C)
            </span>
            <span>IR: {latestAssessment.internalResistanceMOmega} mΩ</span>
            <span>Cycles: {latestAssessment.cycleCount}</span>
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="mt-4 flex items-center justify-between pt-2 font-mono">
        <span className="text-[11px] text-slate-500">
          Mfg Year: {battery.manufacturingYear}
        </span>

        <div className="flex items-center gap-2">
          {showRequestButton && onRequestClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestClick();
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors shadow"
            >
              Request Battery
            </button>
          )}

          <span className="text-xs text-slate-400 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
            View Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
