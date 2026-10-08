import React, { useState, useEffect } from 'react';
import { Search, X, BatteryCharging, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBattery: (batteryId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectBattery,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Battery[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const all = dbService.getBatteries();
    const filtered = all.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.serialNumber.toLowerCase().includes(q) ||
        b.manufacturer.toLowerCase().includes(q) ||
        b.evModel.toLowerCase().includes(q) ||
        b.chemistry.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3 font-mono">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Battery ID (e.g. EVB-2048), Serial, Manufacturer, or EV Model..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 divide-y divide-slate-800/60 font-mono">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-500 text-sm font-sans">
              <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-700 animate-pulse" />
              <p>Type a battery identifier or search criteria above...</p>
              <div className="flex justify-center gap-2 mt-4 text-xs font-mono text-slate-400">
                <span className="px-2 py-1 bg-slate-800/80 rounded border border-slate-700">EVB-2048</span>
                <span className="px-2 py-1 bg-slate-800/80 rounded border border-slate-700">Tesla Model 3</span>
                <span className="px-2 py-1 bg-slate-800/80 rounded border border-slate-700">EVB-2050</span>
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm font-sans">
              No matching battery records found for &quot;{query}&quot;.
            </div>
          )}

          {results.map((battery) => {
            const badgeColors: Record<string, string> = {
              REUSE: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
              'SECOND-LIFE': 'bg-amber-950/80 text-amber-400 border-amber-800',
              'FURTHER TESTING': 'bg-sky-950/80 text-sky-400 border-sky-800',
              RECYCLING: 'bg-rose-950/80 text-rose-400 border-rose-800',
            };

            return (
              <div
                key={battery.id}
                onClick={() => {
                  onSelectBattery(battery.id);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-lg text-cyan-400 border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm tracking-wide">
                        {battery.id}
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {battery.chemistry}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          badgeColors[battery.latestRecommendation] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {battery.latestRecommendation}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-sans">
                      <span>{battery.manufacturer} ({battery.evModel})</span>
                      <span>•</span>
                      <span className="font-mono">Serial: {battery.serialNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono">Circularity Score</div>
                    <div className="text-base font-bold font-mono text-cyan-400">
                      {battery.latestScore} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center font-mono">
          <span>CELLWISE Global Registry Engine</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> Preliminary Decision Support
          </span>
        </div>
      </div>
    </div>
  );
};
