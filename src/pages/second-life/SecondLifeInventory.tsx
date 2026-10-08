import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Server, Send, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';
import { authService } from '../../services/auth';

export const SecondLifeInventory: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [search, setSearch] = useState('');
  const [chemistryFilter, setChemistryFilter] = useState('ALL');
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);

  const [targetApplication, setTargetApplication] = useState<
    'Stationary Storage' | 'UPS' | 'Solar Storage' | 'Backup Power'
  >('Stationary Storage');
  const [deliveryLocation, setDeliveryLocation] = useState('Substation Grid Beta, Site 4');
  const [notes, setNotes] = useState('Requesting module for commercial solar energy storage trial.');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const loadData = () => {
    const all = dbService.getBatteries();
    const eligible = all.filter(
      (b) => b.latestRecommendation === 'SECOND-LIFE' || b.latestRecommendation === 'REUSE'
    );
    setBatteries(eligible);
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
      b.manufacturer.toLowerCase().includes(q) ||
      b.evModel.toLowerCase().includes(q);

    const matchesChem = chemistryFilter === 'ALL' || b.chemistry === chemistryFilter;
    return matchesQuery && matchesChem;
  });

  const handleOpenRequestModal = (b: Battery) => {
    setSelectedBattery(b);
    setIsSuccess(false);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBattery || !currentUser) return;

    dbService.createSecondLifeRequest(
      selectedBattery.id,
      {
        id: currentUser.id,
        name: currentUser.name,
        organization: currentUser.organization,
      },
      targetApplication,
      deliveryLocation,
      notes
    );

    setIsSuccess(true);
    setTimeout(() => {
      setSelectedBattery(null);
      setIsSuccess(false);
      loadData();
    }, 1500);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Eligible Second-Life Inventory
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Available Battery Candidates ({filtered.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Filtered inventory of refurbished batteries classified for secondary stationary applications.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID (EVB-2048), Manufacturer, Model..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg py-2 pl-9 pr-3 text-white placeholder-slate-500 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Chemistry:</span>
            {['ALL', 'LFP', 'NMC'].map((c) => (
              <button
                key={c}
                onClick={() => setChemistryFilter(c)}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                  chemistryFilter === c
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Master Inventory Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Battery ID</th>
                  <th className="py-3 px-3">Chemistry</th>
                  <th className="py-3 px-3">Capacity Retention</th>
                  <th className="py-3 px-3">Circularity Score</th>
                  <th className="py-3 px-3">Thermal State</th>
                  <th className="py-3 px-3">App Compatibility</th>
                  <th className="py-3 px-3 text-right">Procurement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No second-life candidates are currently available matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((battery) => {
                    const retention = Number(
                      ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
                    );

                    const asm = battery.assessments?.[0];
                    const comp = asm?.applicationCompatibility?.stationaryStorage || 90;

                    return (
                      <tr key={battery.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">
                          <button
                            onClick={() => navigate(`/battery/${battery.id}/passport`)}
                            className="hover:underline text-cyan-400 flex items-center gap-1"
                          >
                            {battery.id} <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {battery.chemistry}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-200">
                          {retention}% <span className="text-[10px] text-slate-500">({battery.currentCapacityAh} Ah)</span>
                        </td>

                        <td className="py-3.5 px-3 font-bold text-amber-400">
                          {battery.latestScore} / 100
                        </td>

                        <td className="py-3.5 px-3 text-slate-300">
                          {asm?.operatingTempC || 31}°C (ΔT +{asm?.tempRiseC || 2.8}°C)
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-xs font-bold text-cyan-400">
                            Stationary: {comp}%
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleOpenRequestModal(battery)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow flex items-center gap-1.5 ml-auto"
                          >
                            <Send className="w-3.5 h-3.5" /> Request Battery
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

        {/* Request Battery Modal */}
        {selectedBattery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Send className="w-4 h-4 text-amber-400" /> Request Allocation: {selectedBattery.id}
                </div>
                <button
                  onClick={() => setSelectedBattery(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Request Submitted!</h4>
                  <p className="text-slate-400 text-xs">
                    Your allocation request for {selectedBattery.id} was sent to the Refurbisher Portal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Application *</label>
                    <select
                      value={targetApplication}
                      onChange={(e) => setTargetApplication(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Stationary Storage">Stationary Grid Storage (Peak Shaving)</option>
                      <option value="UPS">Industrial UPS Backup</option>
                      <option value="Solar Storage">Solar Microgrid Storage</option>
                      <option value="Backup Power">Telecom Standby Power</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Delivery Site Location *</label>
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Project Notes & Specifications</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBattery(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow"
                    >
                      Submit Allocation Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
