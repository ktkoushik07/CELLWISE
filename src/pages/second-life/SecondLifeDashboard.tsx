import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ArrowRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery, SecondLifeRequest } from '../../types/battery';
import { BatteryCard } from '../../components/battery/BatteryCard';

export const SecondLifeDashboard: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [requests, setRequests] = useState<SecondLifeRequest[]>([]);
  const navigate = useNavigate();

  const loadData = () => {
    const all = dbService.getBatteries();
    const eligible = all.filter(
      (b) => b.latestRecommendation === 'SECOND-LIFE' || b.latestRecommendation === 'REUSE'
    );
    setBatteries(eligible);

    const reqs = dbService.getRequests();
    setRequests(reqs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cellwise_db_change', loadData);
    return () => window.removeEventListener('cellwise_db_change', loadData);
  }, []);

  const totalAvailable = batteries.length;
  const highQuality = batteries.filter((b) => b.latestScore >= 75).length;
  const pendingReqs = requests.filter((r) => r.status === 'Pending').length;
  const approvedReqs = requests.filter((r) => r.status === 'Approved').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Second-Life Stationary Energy Portal
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Second-Life Candidate Procurement Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Source verified used EV battery modules for grid storage, solar backup, & UPS systems.
            </p>
          </div>

          <button
            onClick={() => navigate('/second-life/batteries')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-extrabold text-xs transition-all shadow-lg shadow-amber-950/50 flex items-center gap-2"
          >
            Explore Inventory ({totalAvailable}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 uppercase">Available Inventory</div>
            <div className="text-3xl font-extrabold text-white">{totalAvailable}</div>
            <div className="text-[10px] text-slate-500">Verified Second-Life & Reuse</div>
          </div>

          <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-amber-400 uppercase">High-Grade Candidates</div>
            <div className="text-3xl font-extrabold text-amber-400">{highQuality}</div>
            <div className="text-[10px] text-slate-500">Circularity Score ≥ 75</div>
          </div>

          <div className="bg-slate-900 border border-sky-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-sky-400 uppercase">Pending Requests</div>
            <div className="text-3xl font-extrabold text-sky-400">{pendingReqs}</div>
            <div className="text-[10px] text-slate-500">Awaiting Refurbisher Approval</div>
          </div>

          <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-emerald-400 uppercase">Allocated Batteries</div>
            <div className="text-3xl font-extrabold text-emerald-400">{approvedReqs}</div>
            <div className="text-[10px] text-slate-500">Approved Allocation Requests</div>
          </div>
        </div>

        {/* Latest Available Candidates Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Featured Second-Life Candidates
              </h3>
              <p className="text-xs text-slate-400">Real-time feed from Refurbisher evaluations</p>
            </div>

            <button
              onClick={() => navigate('/second-life/batteries')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              View All Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batteries.slice(0, 6).map((battery) => (
              <BatteryCard
                key={battery.id}
                battery={battery}
                onClick={() => navigate(`/battery/${battery.id}/passport`)}
                showRequestButton={true}
                onRequestClick={() => navigate('/second-life/batteries')}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
