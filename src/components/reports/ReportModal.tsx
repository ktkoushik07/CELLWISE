import React from 'react';
import { X, Printer, ShieldCheck, Zap, Cpu } from 'lucide-react';
import type { BatteryAssessment, Battery } from '../../types/battery';
import { Logo } from '../common/Logo';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  battery: Battery;
  assessment: BatteryAssessment;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  battery,
  assessment,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8 font-sans">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Official Assessment Report Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div id="printable-report-canvas" className="p-8 bg-slate-950 text-slate-100 font-sans space-y-6">
          {/* Letterhead Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-6">
            <Logo showSubtitle={true} size="md" />
            <div className="text-right font-mono">
              <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase">
                CELLWISE PRELIMINARY REPORT
              </div>
              <div className="text-sm font-bold text-white mt-1">ID: {battery.id}</div>
              <div className="text-xs text-slate-400">Date: {assessment.assessmentDate}</div>
              <div className="text-xs text-slate-500">Ref: REF-AUDIT-{assessment.id.slice(-6)}</div>
            </div>
          </div>

          {/* Executive Summary Ribbon */}
          <div className="grid grid-cols-3 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono">
            <div>
              <div className="text-[11px] text-slate-400 uppercase">Circularity Score</div>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                {assessment.circularityScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase">Recommended Pathway</div>
              <div className="text-base font-extrabold text-emerald-400 mt-1 uppercase tracking-wide">
                {assessment.recommendation}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase">Capacity Retention</div>
              <div className="text-2xl font-bold text-white mt-1">
                {assessment.capacityRetentionPercent}%
              </div>
            </div>
          </div>

          {/* Section 1: Battery Identity Spec */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> 1. Battery System Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Battery ID</span>
                <span className="font-bold text-white">{battery.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Serial Number</span>
                <span className="font-bold text-slate-200">{battery.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Manufacturer</span>
                <span className="font-bold text-slate-200">{battery.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-500 block">EV Model</span>
                <span className="font-bold text-slate-200">{battery.evModel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cell Chemistry</span>
                <span className="font-bold text-cyan-300">{battery.chemistry}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mfg Year / Age</span>
                <span className="font-bold text-slate-200">{battery.manufacturingYear} ({assessment.ageYears} yrs)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Electrical & Thermal Diagnostics */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 2. Empirical Diagnostics & Test Data
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Rated Capacity</span>
                <span className="font-bold text-white">{assessment.ratedCapacityAh} Ah</span>
              </div>
              <div>
                <span className="text-slate-500 block">Measured Capacity</span>
                <span className="font-bold text-white">{assessment.measuredCapacityAh} Ah</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nominal Voltage</span>
                <span className="font-bold text-white">{assessment.voltageV} V</span>
              </div>
              <div>
                <span className="text-slate-500 block">Internal Resistance</span>
                <span className="font-bold text-amber-300">{assessment.internalResistanceMOmega} mΩ</span>
              </div>
              <div>
                <span className="text-slate-500 block">Voltage Drop</span>
                <span className="font-bold text-slate-200">{assessment.voltageDropV} V</span>
              </div>
              <div>
                <span className="text-slate-500 block">Voltage Recovery</span>
                <span className="font-bold text-slate-200">{assessment.recoveryTimeSec} s</span>
              </div>
              <div>
                <span className="text-slate-500 block">Operating Temp</span>
                <span className="font-bold text-slate-200">{assessment.operatingTempC} °C</span>
              </div>
              <div>
                <span className="text-slate-500 block">Thermal Rise (ΔT)</span>
                <span className="font-bold text-slate-200">+{assessment.tempRiseC} °C</span>
              </div>
            </div>
          </div>

          {/* Section 3: Engineering Rationale */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
              3. Automated Engineering Rationale & Justification
            </h4>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              {assessment.reasoning.map((r, i) => (
                <p key={i} className="text-slate-300 flex items-start gap-2">
                  <span>{r}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Signoff & Mandatory Disclaimer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 font-mono">
            <div className="flex justify-between items-end text-xs text-slate-400">
              <div>
                <span className="block text-slate-500 text-[10px]">EVALUATED BY</span>
                <span className="font-bold text-white">{assessment.technicianName}</span>
                <span className="block text-slate-500 text-[10px]">Apex EV Service Centre</span>
              </div>
              <div className="text-right">
                <span className="block text-slate-500 text-[10px]">VERIFICATION STAMP</span>
                <span className="text-cyan-400 font-bold">CELLWISE VALIDATED</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <strong className="text-amber-400">LEGAL DISCLAIMER:</strong> This report provides preliminary screening and decision-support guidance generated by the CELLWISE circularity rules engine. It does not replace formal high-voltage industrial battery safety testing, factory UN 38.3 certification, or official thermal runaway clearance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
