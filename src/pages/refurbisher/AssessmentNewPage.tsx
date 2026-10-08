import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Sparkles,
  Play,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { dbService } from '../../services/db';
import type { ChemistryType, ThermalCondition } from '../../types/battery';
import type { RawAssessmentInput } from '../../services/circularityEngine';

export const AssessmentNewPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Step 1: Identity
  const [batteryId, setBatteryId] = useState('EVB-2048');
  const [serialNumber, setSerialNumber] = useState('SN-TESLA-LFP-88902');
  const [manufacturer, setManufacturer] = useState('Tesla');
  const [evModel, setEvModel] = useState('Model 3 Standard Range');
  const [chemistry, setChemistry] = useState<ChemistryType>('LFP');
  const [manufacturingYear, setManufacturingYear] = useState(2021);

  // Step 2: History
  const [ageYears, setAgeYears] = useState(5);
  const [cycleCount, setCycleCount] = useState(920);
  const [previousApplication, setPreviousApplication] = useState('EV Drivetrain');
  const [knownDamage, setKnownDamage] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');

  // Step 3: Electrical Data
  const [ratedCapacityAh, setRatedCapacityAh] = useState(40);
  const [measuredCapacityAh, setMeasuredCapacityAh] = useState(29);
  const [voltageV, setVoltageV] = useState(48.2);
  const [currentA, setCurrentA] = useState(1.2);
  const [internalResistanceMOmega, setInternalResistanceMOmega] = useState(18);
  const [voltageDropV, setVoltageDropV] = useState(0.35);
  const [recoveryTimeSec, setRecoveryTimeSec] = useState(1.4);

  // Step 4: Thermal Data
  const [operatingTempC, setOperatingTempC] = useState(31);
  const [tempRiseC, setTempRiseC] = useState(2.8);
  const [thermalCondition, setThermalCondition] = useState<ThermalCondition>('Normal');

  // Quick Preset Scenarios (Prompt #51, #52, #53)
  const applyPresetScenario = (scenario: 1 | 2 | 3) => {
    setError('');
    if (scenario === 1) {
      // EVB-2048: Second-Life Candidate
      setBatteryId('EVB-2048');
      setSerialNumber('SN-TESLA-LFP-88902');
      setManufacturer('Tesla');
      setEvModel('Model 3 Standard Range');
      setChemistry('LFP');
      setManufacturingYear(2021);
      setAgeYears(5);
      setCycleCount(920);
      setPreviousApplication('EV Drivetrain');
      setKnownDamage(false);
      setDamageDescription('');
      setRatedCapacityAh(40);
      setMeasuredCapacityAh(29);
      setVoltageV(48.2);
      setCurrentA(1.2);
      setInternalResistanceMOmega(18);
      setVoltageDropV(0.35);
      setRecoveryTimeSec(1.4);
      setOperatingTempC(31);
      setTempRiseC(2.8);
      setThermalCondition('Normal');
    } else if (scenario === 2) {
      // EVB-2050: Recycling Candidate
      setBatteryId('EVB-2050');
      setSerialNumber('SN-LG-NMC-99411');
      setManufacturer('LG Energy Solution');
      setEvModel('Chevy Bolt EV');
      setChemistry('NMC');
      setManufacturingYear(2019);
      setAgeYears(7);
      setCycleCount(1840);
      setPreviousApplication('EV Drivetrain');
      setKnownDamage(true);
      setDamageDescription('Sub-module swelling detected under 2C pulse');
      setRatedCapacityAh(60);
      setMeasuredCapacityAh(22);
      setVoltageV(44.1);
      setCurrentA(2.5);
      setInternalResistanceMOmega(48);
      setVoltageDropV(1.2);
      setRecoveryTimeSec(4.2);
      setOperatingTempC(46);
      setTempRiseC(9.5);
      setThermalCondition('Critical');
    } else if (scenario === 3) {
      // EVB-2052: Further Testing Candidate
      setBatteryId('EVB-2052');
      setSerialNumber('SN-CATL-LFP-30219');
      setManufacturer('CATL');
      setEvModel('Hyundai Ioniq 5');
      setChemistry('LFP');
      setManufacturingYear(2022);
      setAgeYears(4);
      setCycleCount(1100);
      setPreviousApplication('Urban Taxi Fleet');
      setKnownDamage(false);
      setDamageDescription('');
      setRatedCapacityAh(55);
      setMeasuredCapacityAh(32);
      setVoltageV(49.0);
      setCurrentA(1.5);
      setInternalResistanceMOmega(32);
      setVoltageDropV(0.65);
      setRecoveryTimeSec(3.1);
      setOperatingTempC(36);
      setTempRiseC(5.2);
      setThermalCondition('Elevated');
    }
  };

  const validateStep = (currentStep: number) => {
    setError('');
    if (currentStep === 1) {
      if (!batteryId.trim()) return 'Battery ID is required.';
      if (!serialNumber.trim()) return 'Serial Number is required.';
      if (manufacturingYear < 2010 || manufacturingYear > new Date().getFullYear()) {
        return 'Please enter a valid manufacturing year.';
      }
    } else if (currentStep === 3) {
      if (measuredCapacityAh > ratedCapacityAh) {
        return 'Measured capacity cannot exceed rated capacity unless explicitly marked as recalibrated data.';
      }
      if (ratedCapacityAh <= 0 || measuredCapacityAh <= 0) {
        return 'Capacity values must be greater than 0 Ah.';
      }
      if (internalResistanceMOmega <= 0) {
        return 'Internal resistance must be greater than 0 mΩ.';
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setStep(step + 1);
  };

  const handleAnalyse = () => {
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }

    const rawInput: RawAssessmentInput = {
      ratedCapacityAh: Number(ratedCapacityAh),
      measuredCapacityAh: Number(measuredCapacityAh),
      voltageV: Number(voltageV),
      currentA: Number(currentA),
      internalResistanceMOmega: Number(internalResistanceMOmega),
      voltageDropV: Number(voltageDropV),
      recoveryTimeSec: Number(recoveryTimeSec),
      operatingTempC: Number(operatingTempC),
      tempRiseC: Number(tempRiseC),
      thermalCondition,
      ageYears: Number(ageYears),
      cycleCount: Number(cycleCount),
      chemistry,
      previousApplication,
      knownDamage,
      damageDescription,
    };

    try {
      const existing = dbService.getBatteryById(batteryId);
      if (existing) {
        const result = dbService.createBattery(
          {
            id: `${batteryId}-REV${Date.now().toString().slice(-3)}`,
            serialNumber,
            manufacturer,
            evModel,
            chemistry,
            manufacturingYear: Number(manufacturingYear),
          },
          rawInput,
          'Elena Vance (Refurb Specialist)'
        );
        triggerConfetti();
        navigate(`/refurbisher/assessment/${result.battery.id}`);
      } else {
        const result = dbService.createBattery(
          {
            id: batteryId,
            serialNumber,
            manufacturer,
            evModel,
            chemistry,
            manufacturingYear: Number(manufacturingYear),
          },
          rawInput,
          'Elena Vance (Refurb Specialist)'
        );
        triggerConfetti();
        navigate(`/refurbisher/assessment/${result.battery.id}`);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to analyze battery.');
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#10B981', '#F59E0B'],
    });
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Diagnostic Assessment Engine
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create & Evaluate Battery Record
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Multi-step physical, electrical, and thermal data entry.
            </p>
          </div>

          {/* Quick Preset Buttons (Prompts #51, #52, #53) */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[10px] text-slate-500 hidden md:inline">Quick Test Demo:</span>
            <button
              onClick={() => applyPresetScenario(1)}
              className="px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-[11px] font-bold"
            >
              Demo 1 (Second-Life)
            </button>
            <button
              onClick={() => applyPresetScenario(2)}
              className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-[11px] font-bold"
            >
              Demo 2 (Recycle)
            </button>
            <button
              onClick={() => applyPresetScenario(3)}
              className="px-2.5 py-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg text-[11px] font-bold"
            >
              Demo 3 (Testing)
            </button>
          </div>
        </div>

        {/* Step Stepper Progress */}
        <div className="grid grid-cols-5 gap-2 font-mono text-xs">
          {[
            { stepNum: 1, label: 'Identity' },
            { stepNum: 2, label: 'History' },
            { stepNum: 3, label: 'Electrical' },
            { stepNum: 4, label: 'Thermal' },
            { stepNum: 5, label: 'Review & Run' },
          ].map((s) => (
            <div
              key={s.stepNum}
              onClick={() => setStep(s.stepNum)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                step === s.stepNum
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-700 shadow-md shadow-cyan-950/40 font-bold'
                  : step > s.stepNum
                  ? 'bg-slate-900 text-slate-300 border-slate-700'
                  : 'bg-slate-950 text-slate-600 border-slate-900'
              }`}
            >
              <span className="block text-[10px] uppercase text-slate-500">Step 0{s.stepNum}</span>
              <span className="text-xs truncate">{s.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-rose-950/90 border border-rose-800 rounded-xl text-xs text-rose-200 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Step 1: Battery Identity & Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Battery ID *</label>
                  <input
                    type="text"
                    value={batteryId}
                    onChange={(e) => setBatteryId(e.target.value)}
                    placeholder="e.g. EVB-2048"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Serial Number *</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. SN-TESLA-LFP-88902"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Manufacturer</label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  >
                    <option value="Tesla">Tesla</option>
                    <option value="LG Energy Solution">LG Energy Solution</option>
                    <option value="CATL">CATL</option>
                    <option value="Panasonic">Panasonic</option>
                    <option value="BYD">BYD</option>
                    <option value="Samsung SDI">Samsung SDI</option>
                    <option value="SK On">SK On</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">EV Vehicle Model</label>
                  <input
                    type="text"
                    value={evModel}
                    onChange={(e) => setEvModel(e.target.value)}
                    placeholder="e.g. Model 3 Standard Range"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cell Chemistry *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChemistry('LFP')}
                      className={`p-2.5 rounded-lg border text-center font-bold ${
                        chemistry === 'LFP'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      LFP (Lithium Iron)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChemistry('NMC')}
                      className={`p-2.5 rounded-lg border text-center font-bold ${
                        chemistry === 'NMC'
                          ? 'bg-purple-950 text-purple-400 border-purple-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      NMC (Nickel Manganese)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    value={manufacturingYear}
                    onChange={(e) => setManufacturingYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HISTORY */}
          {step === 2 && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Step 2: Operational History & Damage Inspection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Battery Age (Years)</label>
                  <input
                    type="number"
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Approximate Cycle Count</label>
                  <input
                    type="number"
                    value={cycleCount}
                    onChange={(e) => setCycleCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Previous Application</label>
                  <input
                    type="text"
                    value={previousApplication}
                    onChange={(e) => setPreviousApplication(e.target.value)}
                    placeholder="e.g. EV Drivetrain, Taxi Fleet"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Known Physical Damage?</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                      <input
                        type="radio"
                        name="damage"
                        checked={!knownDamage}
                        onChange={() => setKnownDamage(false)}
                      />
                      <span>No Damage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-rose-400 font-bold">
                      <input
                        type="radio"
                        name="damage"
                        checked={knownDamage}
                        onChange={() => setKnownDamage(true)}
                      />
                      <span>Damage Detected</span>
                    </label>
                  </div>
                </div>

                {knownDamage && (
                  <div className="sm:col-span-2">
                    <label className="block text-rose-300 font-bold mb-1">Damage Description</label>
                    <input
                      type="text"
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      placeholder="e.g. Sub-module pouch swelling, housing micro-crack..."
                      className="w-full bg-slate-950 border border-rose-900 focus:border-rose-500 rounded-lg p-2.5 text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: ELECTRICAL TEST DATA */}
          {step === 3 && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Step 3: Empirical Electrical Test Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Rated Capacity (Ah) *</label>
                  <input
                    type="number"
                    value={ratedCapacityAh}
                    onChange={(e) => setRatedCapacityAh(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Measured Capacity (Ah) *</label>
                  <input
                    type="number"
                    value={measuredCapacityAh}
                    onChange={(e) => setMeasuredCapacityAh(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-cyan-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nominal Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={voltageV}
                    onChange={(e) => setVoltageV(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Test Current (A)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentA}
                    onChange={(e) => setCurrentA(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Internal Resistance (mΩ)</label>
                  <input
                    type="number"
                    value={internalResistanceMOmega}
                    onChange={(e) => setInternalResistanceMOmega(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-amber-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Voltage Drop Under Load (V)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={voltageDropV}
                    onChange={(e) => setVoltageDropV(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Voltage Recovery Time (sec)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recoveryTimeSec}
                    onChange={(e) => setRecoveryTimeSec(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: THERMAL DATA */}
          {step === 4 && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Step 4: Thermal Response & Stress Test Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operating Temperature (°C)</label>
                  <input
                    type="number"
                    value={operatingTempC}
                    onChange={(e) => setOperatingTempC(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Temperature Rise ΔT (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempRiseC}
                    onChange={(e) => setTempRiseC(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thermal Condition</label>
                  <select
                    value={thermalCondition}
                    onChange={(e) => setThermalCondition(e.target.value as ThermalCondition)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white"
                  >
                    <option value="Normal">Normal (&lt; 35°C, ΔT &lt; 4°C)</option>
                    <option value="Elevated">Elevated (35–42°C, ΔT 4–7°C)</option>
                    <option value="Critical">Critical (&gt; 45°C or Rapid ΔT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & ANALYSE */}
          {step === 5 && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Step 5: Review Summary & Execute Calculation
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">BATTERY ID</span>
                  <span className="font-bold text-white text-sm">{batteryId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CHEMISTRY</span>
                  <span className="font-bold text-cyan-400">{chemistry}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CAPACITY RETENTION</span>
                  <span className="font-bold text-white">
                    {((measuredCapacityAh / ratedCapacityAh) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">INTERNAL RESISTANCE</span>
                  <span className="font-bold text-amber-400">{internalResistanceMOmega} mΩ</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-xl space-y-2 text-cyan-200 font-sans">
                <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm font-mono">
                  <Sparkles className="w-4 h-4" /> CELLWISE Transparent Scoring Rules Ready
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  Clicking &quot;Analyse Battery&quot; will compute the weighted Circularity Score (0-100), generate engineering rationale, and route the pack to the target pathway in the shared ecosystem.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAnalyse}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-950/60"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Analyse Battery & Generate Score
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
