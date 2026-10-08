import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';

export const RefurbisherSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6 font-mono text-xs max-w-3xl">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" /> Refurbishing Station Settings & Thresholds
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure local battery testing station defaults and scoring engine thresholds.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Testing Facility Name</label>
              <input
                type="text"
                defaultValue="Apex EV Service & Refurbishing Centre (Station 4)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Reuse Score Threshold</label>
              <input
                type="number"
                defaultValue={80}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Second-Life Minimum Score Threshold</label>
              <input
                type="number"
                defaultValue={65}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saved && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow ml-auto flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
};
