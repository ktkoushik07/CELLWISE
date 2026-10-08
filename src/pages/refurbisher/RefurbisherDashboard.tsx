import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';

export const RefurbisherDashboard: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const navigate = useNavigate();

  const loadData = () => {
    setBatteries(dbService.getBatteries());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cellwise_db_change', loadData);
    return () => window.removeEventListener('cellwise_db_change', loadData);
  }, []);

  const total = batteries.length;
  const reuseCount = batteries.filter((b) => b.latestRecommendation === 'REUSE').length;
  const secondLifeCount = batteries.filter((b) => b.latestRecommendation === 'SECOND-LIFE').length;
  const testingCount = batteries.filter((b) => b.latestRecommendation === 'FURTHER TESTING').length;
  const recycleCount = batteries.filter((b) => b.latestRecommendation === 'RECYCLING').length;

  const pathwayData = [
    { name: 'Reuse', value: reuseCount, color: '#10B981' },
    { name: 'Second-Life', value: secondLifeCount, color: '#F59E0B' },
    { name: 'Testing', value: testingCount, color: '#0284C7' },
    { name: 'Recycling', value: recycleCount, color: '#F43F5E' },
  ];

  const trendData = [
    { month: 'May', Assessments: 14, AvgScore: 78 },
    { month: 'Jun', Assessments: 18, AvgScore: 75 },
    { month: 'Jul', Assessments: 24, AvgScore: 72 },
    { month: 'Aug', Assessments: 22, AvgScore: 74 },
    { month: 'Sep', Assessments: 28, AvgScore: 76 },
    { month: 'Oct', Assessments: 31, AvgScore: 77 },
  ];

  const recentAssessments = batteries.slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header & New Assessment Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Apex EV Refurbishing Centre
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Battery Assessment & Circularity Intelligence
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Standardized preliminary screening and pathway classification engine.
            </p>
          </div>

          <button
            onClick={() => navigate('/refurbisher/assessment/new')}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Start New Assessment
          </button>
        </div>

        {/* Top KPIs Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 uppercase">Total Evaluated</div>
            <div className="text-3xl font-extrabold text-white">{total}</div>
            <div className="text-[10px] text-slate-500">Active Records</div>
          </div>

          <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-emerald-400 uppercase">Reuse Candidates</div>
            <div className="text-3xl font-extrabold text-emerald-400">{reuseCount}</div>
            <div className="text-[10px] text-slate-500">Score ≥ 80</div>
          </div>

          <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-amber-400 uppercase">Second-Life</div>
            <div className="text-3xl font-extrabold text-amber-400">{secondLifeCount}</div>
            <div className="text-[10px] text-slate-500">Score 65–79</div>
          </div>

          <div className="bg-slate-900 border border-sky-900/60 p-4 rounded-xl space-y-1">
            <div className="text-[11px] text-sky-400 uppercase">Further Testing</div>
            <div className="text-3xl font-extrabold text-sky-400">{testingCount}</div>
            <div className="text-[10px] text-slate-500">Lab Diagnostics</div>
          </div>

          <div className="bg-slate-900 border border-rose-900/60 p-4 rounded-xl space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[11px] text-rose-400 uppercase">Recycling</div>
            <div className="text-3xl font-extrabold text-rose-400">{recycleCount}</div>
            <div className="text-[10px] text-slate-500">Material Recovery</div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pathway Donut Chart */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 font-mono">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Circularity Pathway Distribution
              </h3>
              <span className="text-[10px] text-slate-500">CELLWISE Scoring</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pathwayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pathwayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              {pathwayData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}:</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Trend Line Chart */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Assessment Volume & Average Circularity Score
              </h3>
              <span className="text-[10px] text-cyan-400">Monthly Diagnostic Run</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="Assessments" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="AvgScore" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Monthly Assessments
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block border-dashed" /> Avg Circularity Score
              </span>
            </div>
          </div>
        </div>

        {/* Recent Battery Assessments Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Battery Assessments
              </h3>
              <p className="text-xs text-slate-400">Latest diagnostic runs across all service stations</p>
            </div>
            <button
              onClick={() => navigate('/refurbisher/batteries')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              View All Batteries <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Battery ID</th>
                  <th className="py-2.5 px-3">Chemistry</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Capacity Retention</th>
                  <th className="py-2.5 px-3">Circularity Score</th>
                  <th className="py-2.5 px-3">Pathway</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentAssessments.map((battery) => {
                  const retention = Number(
                    ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
                  );

                  return (
                    <tr
                      key={battery.id}
                      onClick={() => navigate(`/refurbisher/assessment/${battery.id}`)}
                      className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-white">{battery.id}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {battery.chemistry}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{battery.manufacturer}</td>
                      <td className="py-3 px-3 text-slate-200">
                        {retention}% <span className="text-[10px] text-slate-500">({battery.currentCapacityAh} Ah)</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-400">{battery.latestScore} / 100</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-950 text-slate-200">
                          {battery.latestRecommendation}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-cyan-400 hover:text-cyan-300 font-bold">
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
