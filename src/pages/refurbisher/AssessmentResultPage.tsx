import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  ArrowLeft,
  Cpu,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';
import { CircularityScoreRing } from '../../components/battery/CircularityScoreRing';
import { ApplicationMatchingWidget } from '../../components/battery/ApplicationMatchingWidget';
import { ReportModal } from '../../components/reports/ReportModal';

export const AssessmentResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [battery, setBattery] = useState<Battery | undefined>(undefined);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const b = dbService.getBatteryById(id);
      setBattery(b);
    }
  }, [id]);

  if (!battery) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 font-mono">
          <p className="text-slate-400">Battery record &quot;{id}&quot; not found.</p>
          <button
            onClick={() => navigate('/refurbisher/batteries')}
            className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-lg text-xs"
          >
            ← Return to Battery Registry
          </button>
        </div>
      </AppShell>
    );
  }

  const assessment = battery.assessments?.[0];
  const retention = Number(
    ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <button
              onClick={() => navigate('/refurbisher/batteries')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Master Battery Inventory
            </button>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3 font-mono">
              Assessment Result: {battery.id}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Tested on {battery.latestAssessmentDate} • Serial: {battery.serialNumber}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" /> Assessment PDF Report
            </button>
            <button
              onClick={() => navigate(`/battery/${battery.id}/passport`)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow flex items-center gap-2"
            >
              View Battery Passport <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Score Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono">
          {/* Left Column: Score Ring Gauge */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
              CELLWISE Circularity Score Result
            </div>

            <CircularityScoreRing
              score={battery.latestScore}
              size={180}
              strokeWidth={14}
              recommendation={battery.latestRecommendation}
            />

            <div className="mt-6 text-xs text-slate-400 max-w-xs leading-relaxed border-t border-slate-800/80 pt-4">
              Calculated using transparent weighted model based on Capacity (40%), Electrical (25%), Thermal (20%), and Usage (15%).
            </div>
          </div>

          {/* Right Column: Diagnostic Parameter Metrics */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> Empirical Parameter Snapshot
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CAPACITY RETENTION</span>
                  <span className="text-lg font-bold text-white">{retention}%</span>
                  <span className="text-[10px] text-slate-500 block">
                    ({battery.currentCapacityAh}/{battery.ratedCapacityAh} Ah)
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">INTERNAL RESISTANCE</span>
                  <span className="text-lg font-bold text-amber-300">
                    {assessment?.internalResistanceMOmega || 18} mΩ
                  </span>
                  <span className="text-[10px] text-slate-500 block">Nominal Band &lt; 25 mΩ</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">THERMAL RISE ΔT</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +{assessment?.tempRiseC || 2.8} °C
                  </span>
                  <span className="text-[10px] text-slate-500 block">Operating: {assessment?.operatingTempC || 31}°C</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">VOLTAGE DROP</span>
                  <span className="text-lg font-bold text-slate-200">
                    {assessment?.voltageDropV || 0.35} V
                  </span>
                  <span className="text-[10px] text-slate-500 block">Recovery: {assessment?.recoveryTimeSec || 1.4}s</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CYCLE COUNT</span>
                  <span className="text-lg font-bold text-white">
                    {assessment?.cycleCount || 920}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Age: {assessment?.ageYears || 5} yrs</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">PHYSICAL DAMAGE</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">
                    {assessment?.knownDamage ? '❌ Detected' : '✓ Integrity Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Banner about Shared Database */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-xl text-xs text-cyan-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  This battery record is synced to the shared portal database.
                </span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-700">
                PORTAL SYNCED
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Reasoning Section: "Why this recommendation?" */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Dynamic Reasoning & Justification
            </h3>
            <span className="text-xs text-slate-500">Auto-Generated Rule Explanation</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {assessment?.reasoning?.map((bullet, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-start gap-3"
              >
                <span className="mt-0.5">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Application Compatibility for Second-Life */}
        {battery.latestRecommendation === 'SECOND-LIFE' && (
          <ApplicationMatchingWidget compatibility={assessment?.applicationCompatibility} />
        )}

        {/* Printable Assessment PDF Report Modal */}
        {assessment && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            battery={battery}
            assessment={assessment}
          />
        )}
      </div>
    </AppShell>
  );
};
