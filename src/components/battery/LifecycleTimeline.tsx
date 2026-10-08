import React from 'react';
import { Factory, Car, Wrench, Activity, RefreshCw, Recycle, CheckCircle2 } from 'lucide-react';
import type { LifecycleEvent } from '../../types/battery';

interface LifecycleTimelineProps {
  events: LifecycleEvent[];
  currentStatus: string;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ events, currentStatus }) => {
  const getStageIcon = (stage: LifecycleEvent['stage']) => {
    switch (stage) {
      case 'Manufactured':
        return <Factory className="w-4 h-4 text-cyan-400" />;
      case 'EV Usage':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'Service':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'Assessment':
        return <Activity className="w-4 h-4 text-sky-400" />;
      case 'Pathway Routing':
        return <RefreshCw className="w-4 h-4 text-purple-400" />;
      case 'Recycling Process':
        return <Recycle className="w-4 h-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg font-sans">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800 font-mono">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Battery Lifecycle Chain
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">Immutable traceability audit trail</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
          Status: {currentStatus}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, idx) => {
          const isLatest = idx === events.length - 1;

          return (
            <div key={evt.id || idx} className="relative group font-sans">
              {/* Node Bullet */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isLatest
                    ? 'bg-cyan-950 border-cyan-400 shadow-md shadow-cyan-900/50 scale-110'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {getStageIcon(evt.stage)}
              </div>

              {/* Event Content */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1 font-mono">
                  <span className="text-xs font-bold text-slate-200">
                    {evt.title}
                  </span>
                  <span className="text-[11px] text-slate-500">{evt.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{evt.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/50">
                  <span>Operator: {evt.performedBy}</span>
                  {evt.location && <span>Location: {evt.location}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
