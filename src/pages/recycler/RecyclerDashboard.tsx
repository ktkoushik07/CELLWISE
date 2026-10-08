import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ArrowRight, Flame } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';

export const RecyclerDashboard: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const navigate = useNavigate();

  const loadData = () => {
    const all = dbService.getBatteries();
    const recyclingList = all.filter((b) => b.latestRecommendation === 'RECYCLING');
    setBatteries(recyclingList);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cellwise_db_change', loadData);
    return () => window.removeEventListener('cellwise_db_change', loadData);
  }, []);

  const total = batteries.length;
  const identified = batteries.filter((b) => !b.recyclingStatus || b.recyclingStatus === 'Identified').length;
  const collection = batteries.filter((b) => b.recyclingStatus === 'Collection').length;
  const processing = batteries.filter((b) => b.recyclingStatus === 'Processing' || b.recyclingStatus === 'Received').length;
  const completed = batteries.filter((b) => b.recyclingStatus === 'Completed').length;

  const materialYieldData = [
    { material: 'Lithium (Li)', weightKg: total * 8.4, color: '#06B6D4' },
    { material: 'Cobalt (Co)', weightKg: total * 12.2, color: '#8B5CF6' },
    { material: 'Nickel (Ni)', weightKg: total * 24.5, color: '#3B82F6' },
    { material: 'Manganese (Mn)', weightKg: total * 9.8, color: '#10B981' },
    { material: 'Graphite (C)', weightKg: total * 32.0, color: '#64748B' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Recycle className="w-4 h-4" /> EcoMat Recycling & Material Recovery Systems
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Pyrometallurgical & Hydrometallurgical Recycling Queue
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Process end-of-life battery packs and audit black mass material extraction yields.
            </p>
          </div>

          <button
            onClick={() => navigate('/recycler/batteries')}
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-slate-950 font-mono font-extrabold text-xs transition-all shadow-lg shadow-rose-950/50 flex items-center gap-2"
          >
            Manage Recycling Queue ({total}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 uppercase">Recycling Candidates</div>
            <div className="text-3xl font-extrabold text-rose-400">{total}</div>
            <div className="text-[10px] text-slate-500">Circularity Score &lt; 50 or Degraded</div>
          </div>

          <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-amber-400 uppercase">Queued / Collection</div>
            <div className="text-3xl font-extrabold text-amber-400">{identified + collection}</div>
            <div className="text-[10px] text-slate-500">Awaiting Logistics Transport</div>
          </div>

          <div className="bg-slate-900 border border-sky-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-sky-400 uppercase">Active Processing</div>
            <div className="text-3xl font-extrabold text-sky-400">{processing}</div>
            <div className="text-[10px] text-slate-500">Shredding & Leaching Line</div>
          </div>

          <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-emerald-400 uppercase">Completed Recovery</div>
            <div className="text-3xl font-extrabold text-emerald-400">{completed}</div>
            <div className="text-[10px] text-slate-500">Purified Minerals Recovered</div>
          </div>
        </div>

        {/* Material Yield Extraction Forecast Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" /> Estimated Black Mass Mineral Recovery Yield (kg)
              </h3>
              <p className="text-xs text-slate-400">Calculated based on active queued NMC & LFP battery chemistries</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialYieldData}>
                <XAxis dataKey="material" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="weightKg" radius={[6, 6, 0, 0]}>
                  {materialYieldData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
