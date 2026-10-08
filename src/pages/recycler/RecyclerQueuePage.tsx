import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ExternalLink } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery, RecyclingStatus } from '../../types/battery';

export const RecyclerQueuePage: React.FC = () => {
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

  const handleUpdateStatus = (batteryId: string, status: RecyclingStatus) => {
    dbService.updateRecyclingStatus(batteryId, status);
    loadData();
  };

  return (
    <AppShell>
      <div className="space-y-6 font-mono">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Recycle className="w-4 h-4" /> Material Recovery Queue
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Recycling Candidate Processing Queue ({batteries.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Batteries classified for recycling material extraction. Update stage to log progress.
            </p>
          </div>
        </div>

        {/* Recycling Queue Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Chemistry</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Degradation Reason</th>
                  <th className="py-3 px-3">Current Location</th>
                  <th className="py-3 px-3">Workflow Stage</th>
                  <th className="py-3 px-3 text-right">Update Workflow Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batteries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No recycling candidates in queue.
                    </td>
                  </tr>
                ) : (
                  batteries.map((battery) => {
                    const status = battery.recyclingStatus || 'Identified';
                    const asm = battery.assessments?.[0];

                    const statusColors: Record<string, string> = {
                      Identified: 'bg-rose-950 text-rose-400 border-rose-800',
                      Collection: 'bg-amber-950 text-amber-400 border-amber-800',
                      Received: 'bg-sky-950 text-sky-400 border-sky-800',
                      Processing: 'bg-purple-950 text-purple-400 border-purple-800',
                      Completed: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                    };

                    return (
                      <tr key={battery.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">
                          <button
                            onClick={() => navigate(`/battery/${battery.id}/passport`)}
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            {battery.id} <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {battery.chemistry}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-bold text-rose-400">
                          {battery.latestScore} / 100
                        </td>

                        <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                          {asm?.reasoning?.[0] || 'Severe capacity degradation'}
                        </td>

                        <td className="py-3.5 px-3 text-slate-400">{battery.location}</td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              statusColors[status]
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <select
                            value={status}
                            onChange={(e) =>
                              handleUpdateStatus(battery.id, e.target.value as RecyclingStatus)
                            }
                            className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1 text-[11px] focus:outline-none focus:border-rose-500"
                          >
                            <option value="Identified">Identified</option>
                            <option value="Collection">Collection</option>
                            <option value="Received">Received</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                          </select>
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
