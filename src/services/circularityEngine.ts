import type { PathwayRecommendation, ThermalCondition, ChemistryType } from '../types/battery';

export interface RawAssessmentInput {
  ratedCapacityAh: number;
  measuredCapacityAh: number;
  voltageV: number;
  currentA: number;
  internalResistanceMOmega: number;
  voltageDropV: number;
  recoveryTimeSec: number;
  operatingTempC: number;
  tempRiseC: number;
  thermalCondition: ThermalCondition;
  ageYears: number;
  cycleCount: number;
  chemistry: ChemistryType;
  previousApplication?: string;
  knownDamage: boolean;
  damageDescription?: string;
}

export interface CalculationResult {
  capacityRetentionPercent: number;
  electricalScore: number;
  thermalScore: number;
  usageScore: number;
  circularityScore: number;
  recommendation: PathwayRecommendation;
  applicationCompatibility: {
    stationaryStorage: number;
    ups: number;
    solarStorage: number;
    backupPower: number;
  };
  reasoning: string[];
}

export function calculateCircularity(input: RawAssessmentInput): CalculationResult {
  // 1. Capacity Retention
  const capacityRetentionPercent = Number(
    ((input.measuredCapacityAh / input.ratedCapacityAh) * 100).toFixed(1)
  );

  // 2. Electrical Score Calculation
  let electricalScore = 100;
  if (input.internalResistanceMOmega > 15) {
    electricalScore -= (input.internalResistanceMOmega - 15) * 1.5;
  }
  if (input.voltageDropV > 0.4) {
    electricalScore -= (input.voltageDropV - 0.4) * 20;
  }
  if (input.recoveryTimeSec > 1.5) {
    electricalScore -= (input.recoveryTimeSec - 1.5) * 10;
  }
  electricalScore = Math.min(100, Math.max(10, Math.round(electricalScore)));

  // 3. Thermal Score Calculation
  let thermalScore = 100;
  if (input.operatingTempC > 30) {
    thermalScore -= (input.operatingTempC - 30) * 2;
  }
  if (input.tempRiseC > 3) {
    thermalScore -= (input.tempRiseC - 3) * 6;
  }
  if (input.thermalCondition === 'Elevated') {
    thermalScore -= 15;
  } else if (input.thermalCondition === 'Critical') {
    thermalScore -= 45;
  }
  thermalScore = Math.min(100, Math.max(5, Math.round(thermalScore)));

  // 4. Usage Score Calculation
  let usageScore = 100;
  if (input.cycleCount > 800) {
    usageScore -= ((input.cycleCount - 800) / 100) * 4;
  }
  if (input.ageYears > 3) {
    usageScore -= (input.ageYears - 3) * 5;
  }
  usageScore = Math.min(100, Math.max(10, Math.round(usageScore)));

  // 5. Overall Weighted Circularity Score
  let circularityScore = Math.round(
    capacityRetentionPercent * 0.40 +
    electricalScore * 0.25 +
    thermalScore * 0.20 +
    usageScore * 0.15
  );

  if (input.knownDamage) {
    circularityScore = Math.min(circularityScore, 45);
  }

  circularityScore = Math.min(100, Math.max(0, circularityScore));

  // 6. Decision Engine Logic
  let recommendation: PathwayRecommendation;

  if (
    circularityScore >= 80 &&
    input.thermalCondition === 'Normal' &&
    electricalScore >= 75 &&
    !input.knownDamage
  ) {
    recommendation = 'REUSE';
  } else if (
    circularityScore >= 65 ||
    (capacityRetentionPercent >= 65 && input.thermalCondition !== 'Critical' && !input.knownDamage)
  ) {
    recommendation = 'SECOND-LIFE';
  } else if (
    circularityScore >= 48 ||
    input.thermalCondition === 'Elevated' ||
    input.recoveryTimeSec > 3.0
  ) {
    recommendation = 'FURTHER TESTING';
  } else {
    recommendation = 'RECYCLING';
  }

  // 7. Application Compatibility for Second-Life Candidates
  const lfpBonus = input.chemistry === 'LFP' ? 8 : 0;
  const stationaryStorage = Math.min(98, Math.max(25, Math.round(capacityRetentionPercent * 0.85 + lfpBonus + 5)));
  const ups = Math.min(95, Math.max(20, Math.round(electricalScore * 0.80 + capacityRetentionPercent * 0.15)));
  const solarStorage = Math.min(97, Math.max(30, Math.round(capacityRetentionPercent * 0.75 + thermalScore * 0.20 + lfpBonus)));
  const backupPower = Math.min(94, Math.max(20, Math.round(circularityScore * 0.88)));

  // 8. Dynamic Reasoning Bullets
  const reasoning: string[] = [];

  if (capacityRetentionPercent >= 80) {
    reasoning.push(`✓ High capacity retention (${capacityRetentionPercent}%) suitable for prime automotive reuse or high-demand storage.`);
  } else if (capacityRetentionPercent >= 65) {
    reasoning.push(`✓ Usable capacity retention (${capacityRetentionPercent}%) exceeds threshold for stationary energy storage applications.`);
  } else {
    reasoning.push(`⚠ Low capacity retention (${capacityRetentionPercent}%) makes pack unsuitable for high-energy applications.`);
  }

  if (input.thermalCondition === 'Normal' && input.tempRiseC <= 4) {
    reasoning.push(`✓ Thermal response under stress test is stable (Operating: ${input.operatingTempC}°C, ΔT: +${input.tempRiseC}°C).`);
  } else {
    reasoning.push(`⚠ Thermal elevation detected (${input.thermalCondition}, ΔT: +${input.tempRiseC}°C). Requires close thermal monitoring.`);
  }

  if (electricalScore >= 75) {
    reasoning.push(`✓ Electrical parameters within nominal operating band (IR: ${input.internalResistanceMOmega} mΩ, ΔV: ${input.voltageDropV}V).`);
  } else {
    reasoning.push(`⚠ Increased internal resistance (${input.internalResistanceMOmega} mΩ) or voltage drop (${input.voltageDropV}V) noted.`);
  }

  if (input.knownDamage) {
    reasoning.push(`❌ Physical cell or casing damage reported: ${input.damageDescription || 'Structural abnormality'}.`);
  } else {
    reasoning.push(`✓ Enclosure and module physical integrity verified with no structural defects.`);
  }

  if (recommendation === 'REUSE') {
    reasoning.push(`➔ Recommended Pathway: REUSE — Battery exhibits near-prime performance suitable for direct vehicle remanufacturing.`);
  } else if (recommendation === 'SECOND-LIFE') {
    reasoning.push(`➔ Recommended Pathway: SECOND-LIFE CANDIDATE — Ideal for stationary grid storage, solar backup, or UPS systems.`);
  } else if (recommendation === 'FURTHER TESTING') {
    reasoning.push(`➔ Recommended Pathway: FURTHER TESTING — Additional impedance spectroscopy and cell balancing diagnostics required.`);
  } else {
    reasoning.push(`➔ Recommended Pathway: RECYCLING — Cell degradation or thermal risks dictate material harvesting & recycling.`);
  }

  return {
    capacityRetentionPercent,
    electricalScore,
    thermalScore,
    usageScore,
    circularityScore,
    recommendation,
    applicationCompatibility: {
      stationaryStorage,
      ups,
      solarStorage,
      backupPower,
    },
    reasoning,
  };
}
