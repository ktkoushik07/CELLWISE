import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, PlusCircle, ArrowUpDown, BatteryCharging, ExternalLink } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';

export const RefurbisherBatteries: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [search, setSearch] = useState('');
  const [pathwayFilter, setPathwayFilter] = useState<string>('ALL');
  const [chemistryFilter, setChemistryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'id'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  const loadData = () => {
    setBatteries(dbService.getBatteries());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cellwise_db_change', loadData);
    return () => window.removeEventListener('cellwise_db_change', loadData);
  }, []);

  const filtered = batteries.filter((b) => {
    const q = search.toLowerCase();
    const matchesQuery =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.serialNumber.toLowerCase().includes(q) ||
      b.manufacturer.toLowerCase().includes(q) ||
      b.evModel.toLowerCase().includes(q);

    const matchesPathway =
      pathwayFilter === 'ALL' || b.latestRecommendation === pathwayFilter;

    const matchesChemistry =
      chemistryFilter === 'ALL' || b.chemistry === chemistryFilter;

    return matchesQuery && matchesPathway && matchesChemistry;
  });

  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'score') {
      comp = a.latestScore - b.latestScore;
    } else if (sortBy === 'id') {
      comp = a.id.localeCompare(b.id);
    } else {
      comp = a.latestAssessmentDate.localeCompare(b.latestAssessmentDate);
    }
    return sortOrder === 'desc' ? -comp : comp;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4" /> Battery Central Registry
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Master EV Battery Inventory ({sorted.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Search, filter, and inspect verified battery records and diagnostic passports.
            </p>
          </div>

          <button
            onClick={() => navigate('/refurbisher/assessment/new')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Battery Assessment
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by Battery ID (EVB-2048), Serial, Manufacturer..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 pl-9 pr-3 text-white placeholder-slate-500 text-xs focus:outline-none"
              />
            </div>

            {/* Pathway Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'REUSE', 'SECOND-LIFE', 'FURTHER TESTING', 'RECYCLING'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPathwayFilter(p)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                    pathwayFilter === p
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-700 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chemistry & Sorting Sub-bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyan-400" /> Chemistry:
              </span>
              {['ALL', 'LFP', 'NMC'].map((c) => (
                <button
                  key={c}
                  onClick={() => setChemistryFilter(c)}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    chemistryFilter === c
                      ? 'bg-slate-800 text-white border-slate-600 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-cyan-400" /> Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none"
              >
                <option value="score">Circularity Score</option>
                <option value="id">Battery ID</option>
                <option value="date">Assessment Date</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded hover:bg-slate-800"
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Master Battery Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Chemistry</th>
                  <th className="py-3 px-3">Manufacturer / Model</th>
                  <th className="py-3 px-3">Capacity Retention</th>
                  <th className="py-3 px-3">Circularity Score</th>
                  <th className="py-3 px-3">Recommendation</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Passport / Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No battery records match the selected search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  sorted.map((battery) => {
                    const retention = Number(
                      ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
                    );

                    const badgeColors: Record<string, string> = {
                      REUSE: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                      'SECOND-LIFE': 'bg-amber-950 text-amber-400 border-amber-800',
                      'FURTHER TESTING': 'bg-sky-950 text-sky-400 border-sky-800',
                      RECYCLING: 'bg-rose-950 text-rose-400 border-rose-800',
                    };

                    return (
                      <tr
                        key={battery.id}
                        onClick={() => navigate(`/refurbisher/assessment/${battery.id}`)}
                        className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>{battery.id}</span>
                            {battery.id === 'EVB-2048' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                                DEMO 1
                              </span>
                            )}
                            {battery.id === 'EVB-2050' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                                DEMO 2
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {battery.chemistry}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          {battery.manufacturer} ({battery.evModel})
                        </td>

                        <td className="py-3 px-3 text-slate-200">
                          {retention}% <span className="text-[10px] text-slate-500">({battery.currentCapacityAh}/{battery.ratedCapacityAh} Ah)</span>
                        </td>

                        <td className="py-3 px-3 font-bold text-cyan-400">
                          {battery.latestScore} / 100
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              badgeColors[battery.latestRecommendation] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {battery.latestRecommendation}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {battery.status}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/battery/${battery.id}/passport`);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center gap-1"
                            >
                              Passport <ExternalLink className="w-3 h-3 text-cyan-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
