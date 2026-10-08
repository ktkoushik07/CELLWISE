import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { FileText, Printer } from 'lucide-react';
import { dbService } from '../../services/db';

export const RefurbisherReportsPage: React.FC = () => {
  const batteries = dbService.getBatteries();

  return (
    <AppShell>
      <div className="space-y-6 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> Battery Audit & Assessment Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Export standardized PDF audit reports for regulatory and circular economy compliance.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Chemistry</th>
                  <th className="py-3 px-3">Assessment Date</th>
                  <th className="py-3 px-3">Circularity Score</th>
                  <th className="py-3 px-3">Recommendation</th>
                  <th className="py-3 px-3 text-right">PDF Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batteries.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/60">
                    <td className="py-3 px-3 font-bold text-white">{b.id}</td>
                    <td className="py-3 px-3 text-slate-300">{b.chemistry}</td>
                    <td className="py-3 px-3 text-slate-400">{b.latestAssessmentDate}</td>
                    <td className="py-3 px-3 font-bold text-cyan-400">{b.latestScore} / 100</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{b.latestRecommendation}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" /> Print / Export PDF
                      </button>
                    </td>
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
