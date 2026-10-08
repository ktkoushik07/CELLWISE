import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Zap,
  ArrowLeft,
  Printer,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { Battery } from '../../types/battery';
import { LifecycleTimeline } from '../../components/battery/LifecycleTimeline';
import { Logo } from '../../components/common/Logo';

export const BatteryPassportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [battery, setBattery] = useState<Battery | undefined>(undefined);
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
          <p className="text-slate-400">Battery Passport record &quot;{id}&quot; not found.</p>
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

  const retention = Number(
    ((battery.currentCapacityAh / battery.ratedCapacityAh) * 100).toFixed(1)
  );

  const passportUrl = `${window.location.origin}/battery/${battery.id}/passport`;

  return (
    <AppShell>
      <div className="space-y-6 font-mono">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl font-mono">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                DIGITAL PASSPORT
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {battery.id}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Serial: {battery.serialNumber} • Verified Chain of Custody
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-cyan-400" /> Print Passport
            </button>
          </div>
        </div>

        {/* Passport Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono">
          {/* Left Column: QR Code & Verification Stamp */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-between text-center space-y-6">
            <div className="space-y-1">
              <Logo size="sm" showSubtitle={false} />
              <div className="text-[11px] text-slate-400">Official Battery Passport</div>
            </div>

            {/* QR Code Component */}
            <div className="p-4 bg-white rounded-xl shadow-xl border-4 border-slate-950 inline-block">
              <QRCodeSVG
                value={passportUrl}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-1 text-center">
              <div className="text-xs font-bold text-white tracking-wide">
                QR Verification Link
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                {passportUrl}
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> VERIFIED PASSPORT
              </span>
              <span>CELLWISE v2.4</span>
            </div>
          </div>

          {/* Right Column: Specification Matrix */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Technical Specification Matrix
                </h3>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {battery.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MANUFACTURER</span>
                  <span className="font-bold text-white">{battery.manufacturer}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VEHICLE MODEL</span>
                  <span className="font-bold text-white">{battery.evModel}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CELL CHEMISTRY</span>
                  <span className="font-bold text-cyan-400">{battery.chemistry}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MANUFACTURING YEAR</span>
                  <span className="font-bold text-white">{battery.manufacturingYear}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RATED CAPACITY</span>
                  <span className="font-bold text-white">{battery.ratedCapacityAh} Ah</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CURRENT CAPACITY</span>
                  <span className="font-bold text-emerald-400">{battery.currentCapacityAh} Ah</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAPACITY RETENTION</span>
                  <span className="font-bold text-white">{retention}%</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CIRCULARITY SCORE</span>
                  <span className="font-bold text-cyan-400">{battery.latestScore} / 100</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PATHWAY DESTINATION</span>
                  <span className="font-bold text-amber-400">{battery.latestRecommendation}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Last Assessment: {battery.latestAssessmentDate}</span>
              <span>Location: {battery.location}</span>
            </div>
          </div>
        </div>

        {/* Lifecycle Chain Timeline */}
        <LifecycleTimeline events={battery.lifecycleHistory} currentStatus={battery.status} />
      </div>
    </AppShell>
  );
};
