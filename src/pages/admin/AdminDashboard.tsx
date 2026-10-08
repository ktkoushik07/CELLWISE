import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, RotateCcw } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';
import { DEMO_USERS } from '../../services/auth';

export const AdminDashboard: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);

  const loadData = () => {
    setBatteries(dbService.getBatteries());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cellwise_db_change', loadData);
    return () => window.removeEventListener('cellwise_db_change', loadData);
  }, []);

  const totalBatteries = batteries.length;
  const reuseCount = batteries.filter((b) => b.latestRecommendation === 'REUSE').length;
  const secondLifeCount = batteries.filter((b) => b.latestRecommendation === 'SECOND-LIFE').length;
  const testingCount = batteries.filter((b) => b.latestRecommendation === 'FURTHER TESTING').length;
  const recyclingCount = batteries.filter((b) => b.latestRecommendation === 'RECYCLING').length;

  return (
    <AppShell>
      <div className="space-y-6 font-mono">
        {/* Header */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> CELLWISE Ecosystem Administration
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Ecosystem Overview & Platform Governance
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Global oversight across Refurbisher, Second-Life, and Recycler portals.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset demo database to default 30+ battery seed state?')) {
                dbService.resetDatabaseToDefaults();
                loadData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" /> Reset Demo Seed Database
          </button>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 uppercase">Total System Batteries</div>
            <div className="text-3xl font-extrabold text-white">{totalBatteries}</div>
            <div className="text-[10px] text-slate-500">Shared Database Records</div>
          </div>

          <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-emerald-400 uppercase">Reuse Candidates</div>
            <div className="text-3xl font-extrabold text-emerald-400">{reuseCount}</div>
            <div className="text-[10px] text-slate-500">Direct EV Remanufacture</div>
          </div>

          <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-amber-400 uppercase">Second-Life</div>
            <div className="text-3xl font-extrabold text-amber-400">{secondLifeCount}</div>
            <div className="text-[10px] text-slate-500">Grid & Solar Storage</div>
          </div>

          <div className="bg-slate-900 border border-sky-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-sky-400 uppercase">Further Testing</div>
            <div className="text-3xl font-extrabold text-sky-400">{testingCount}</div>
            <div className="text-[10px] text-slate-500">Lab Diagnostics</div>
          </div>

          <div className="bg-slate-900 border border-rose-900/60 p-4 rounded-xl space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[11px] text-rose-400 uppercase">Recycling Queue</div>
            <div className="text-3xl font-extrabold text-rose-400">{recyclingCount}</div>
            <div className="text-[10px] text-slate-500">Material Extraction</div>
          </div>
        </div>

        {/* Ecosystem User Roles Registry */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Platform Multi-Tenant Users & Roles
            </h3>
            <span className="text-xs text-slate-500">RBAC Active Access Control</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Assigned Role Portal</th>
                  <th className="py-2.5 px-3">Organization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {DEMO_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-3 text-cyan-400">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-950 text-slate-200">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{u.organization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
