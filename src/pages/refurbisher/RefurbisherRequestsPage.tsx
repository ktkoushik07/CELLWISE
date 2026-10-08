import React, { useState, useEffect } from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { SecondLifeRequest } from '../../types/battery';
import { useNavigate } from 'react-router-dom';

export const RefurbisherRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<SecondLifeRequest[]>([]);
  const navigate = useNavigate();

  const loadRequests = () => {
    setRequests(dbService.getRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('cellwise_db_change', loadRequests);
    return () => window.removeEventListener('cellwise_db_change', loadRequests);
  }, []);

  const handleUpdate = (reqId: string, status: 'Approved' | 'Rejected') => {
    dbService.updateRequestStatus(reqId, status);
    loadRequests();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Send className="w-4 h-4" /> Second-Life Provider Requests
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Incoming Allocation Requests ({requests.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Review and approve battery acquisition requests submitted by stationary storage providers.
            </p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Requesting Organization</th>
                  <th className="py-3 px-3">Target Application</th>
                  <th className="py-3 px-3">Delivery Site</th>
                  <th className="py-3 px-3">Request Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No second-life battery requests received yet.
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
                        <td className="py-3.5 px-3 font-bold text-white">
                          {req.organization}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            By {req.providerName}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-200">{req.targetApplication}</td>
                        <td className="py-3.5 px-3 text-slate-400">{req.deliveryLocation}</td>
                        <td className="py-3.5 px-3 text-slate-400">{req.requestDate}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              statusColors[req.status] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(req.id, 'Approved')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] shadow"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdate(req.id, 'Rejected')}
                                className="px-3 py-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg text-[11px] border border-slate-700"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              Processed
                            </span>
                          )}
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
