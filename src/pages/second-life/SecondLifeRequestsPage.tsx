import React, { useState, useEffect } from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { SecondLifeRequest } from '../../types/battery';
import { useNavigate } from 'react-router-dom';

export const SecondLifeRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<SecondLifeRequest[]>([]);
  const navigate = useNavigate();

  const loadRequests = () => {
    const list = dbService.getRequests();
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('cellwise_db_change', loadRequests);
    return () => window.removeEventListener('cellwise_db_change', loadRequests);
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 font-mono">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Send className="w-4 h-4" /> My Submitted Procurement Requests
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Allocation Tracking & Status ({requests.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time approval status from EV Service Refurbishers.
            </p>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Target Application</th>
                  <th className="py-3 px-3">Delivery Site</th>
                  <th className="py-3 px-3">Date Submitted</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3 text-right">Inspect Passport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No procurement requests submitted yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => {
                    const statusColors: Record<string, string> = {
                      Pending: 'bg-amber-950 text-amber-400 border-amber-800',
                      Approved: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                      Rejected: 'bg-rose-950 text-rose-400 border-rose-800',
                    };

                    return (
                      <tr key={req.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-300">{req.id}</td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => navigate(`/battery/${req.batteryId}/passport`)}
                            className="font-bold text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            {req.batteryId} <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-white font-bold">{req.targetApplication}</td>
                        <td className="py-3.5 px-3 text-slate-400">{req.deliveryLocation}</td>
                        <td className="py-3.5 px-3 text-slate-400">{req.requestDate}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              statusColors[req.status] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => navigate(`/battery/${req.batteryId}/passport`)}
                            className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-lg text-[11px] border border-slate-700 hover:bg-slate-700"
                          >
                            View Passport →
                          </button>
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
