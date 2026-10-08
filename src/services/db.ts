import type {
  Battery,
  BatteryAssessment,
  LifecycleEvent,
  SecondLifeRequest,
  NotificationItem,
  UserRole,
  RecyclingStatus,
  RequestStatus,
  ThermalCondition,
} from '../types/battery';
import { calculateCircularity, type RawAssessmentInput } from './circularityEngine';

const DB_BATTERIES_KEY = 'cellwise_db_batteries_v1';
const DB_REQUESTS_KEY = 'cellwise_db_requests_v1';
const DB_NOTIFICATIONS_KEY = 'cellwise_db_notifications_v1';

// Broadcast Channel for live multi-tab sync
const dbChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('cellwise_db_channel') : null;

// Initial 30+ Realistic Battery Records Seed Data
const SEED_BATTERIES: Battery[] = [
  {
    id: 'EVB-2048',
    serialNumber: 'SN-TESLA-LFP-88902',
    manufacturer: 'Tesla',
    evModel: 'Model 3 Standard Range',
    chemistry: 'LFP',
    manufacturingYear: 2021,
    ratedCapacityAh: 40,
    currentCapacityAh: 29,
    nominalVoltageV: 48.2,
    location: 'Apex EV Service Centre (Station 4)',
    status: 'Available Second-Life',
    latestScore: 76,
    latestRecommendation: 'SECOND-LIFE',
    latestAssessmentDate: '2026-10-02',
    assessments: [
      {
        id: 'asm-2048-1',
        batteryId: 'EVB-2048',
        assessmentDate: '2026-10-02',
        technicianName: 'Elena Vance',
        ratedCapacityAh: 40,
        measuredCapacityAh: 29,
        voltageV: 48.2,
        currentA: 1.2,
        internalResistanceMOmega: 18,
        voltageDropV: 0.35,
        recoveryTimeSec: 1.4,
        operatingTempC: 31,
        tempRiseC: 2.8,
        thermalCondition: 'Normal',
        ageYears: 5,
        cycleCount: 920,
        previousApplication: 'EV Traction Battery',
        knownDamage: false,
        capacityRetentionPercent: 72.5,
        electricalScore: 82,
        thermalScore: 88,
        usageScore: 70,
        circularityScore: 76,
        recommendation: 'SECOND-LIFE',
        applicationCompatibility: {
          stationaryStorage: 92,
          ups: 84,
          solarStorage: 88,
          backupPower: 82,
        },
        reasoning: [
          '✓ Measured capacity retention (72.5%) is within ideal secondary storage operating envelope.',
          '✓ Thermal rise (+2.8°C) under load remains below normal tolerance limits.',
          '✓ Electrical response is stable (IR: 18 mΩ, Voltage Drop: 0.35V).',
          '➔ Recommended Pathway: SECOND-LIFE CANDIDATE — Ideal for stationary grid storage or solar backup.',
        ],
      },
    ],
    lifecycleHistory: [
      {
        id: 'lc-2048-1',
        batteryId: 'EVB-2048',
        timestamp: '2021-04-12',
        title: 'Battery Pack Manufactured',
        description: 'Module produced and verified at Giga Nevada facility.',
        stage: 'Manufactured',
        performedBy: 'Tesla Inc.',
        location: 'Sparks, NV',
      },
      {
        id: 'lc-2048-2',
        batteryId: 'EVB-2048',
        timestamp: '2021-05-18',
        title: 'Installed in EV Vehicle',
        description: 'Commissioned into Tesla Model 3 drivetrain.',
        stage: 'EV Usage',
        performedBy: 'Automotive OEM',
      },
      {
        id: 'lc-2048-3',
        batteryId: 'EVB-2048',
        timestamp: '2026-09-25',
        title: 'Decommissioned from Fleet',
        description: 'Vehicle reached end-of-service target mileage. Module uninstalled.',
        stage: 'Service',
        performedBy: 'Apex EV Service Centre',
      },
      {
        id: 'lc-2048-4',
        batteryId: 'EVB-2048',
        timestamp: '2026-10-02',
        title: 'CELLWISE Comprehensive Assessment',
        description: 'Automated circularity score generated: 76 / 100. Classified as SECOND-LIFE CANDIDATE.',
        stage: 'Assessment',
        performedBy: 'Elena Vance',
      },
    ],
  },
  {
    id: 'EVB-2050',
    serialNumber: 'SN-LG-NMC-99411',
    manufacturer: 'LG Energy Solution',
    evModel: 'Chevy Bolt EV',
    chemistry: 'NMC',
    manufacturingYear: 2019,
    ratedCapacityAh: 60,
    currentCapacityAh: 22,
    nominalVoltageV: 44.1,
    location: 'Apex EV Service Centre (Bay 2)',
    status: 'Queued Recycling',
    latestScore: 38,
    latestRecommendation: 'RECYCLING',
    latestAssessmentDate: '2026-10-04',
    recyclingStatus: 'Identified',
    assessments: [
      {
        id: 'asm-2050-1',
        batteryId: 'EVB-2050',
        assessmentDate: '2026-10-04',
        technicianName: 'Marcus Miller',
        ratedCapacityAh: 60,
        measuredCapacityAh: 22,
        voltageV: 44.1,
        currentA: 2.5,
        internalResistanceMOmega: 48,
        voltageDropV: 1.2,
        recoveryTimeSec: 4.2,
        operatingTempC: 46,
        tempRiseC: 9.5,
        thermalCondition: 'Critical',
        ageYears: 7,
        cycleCount: 1840,
        previousApplication: 'EV Drivetrain',
        knownDamage: true,
        damageDescription: 'Slight pouch swelling detected on Sub-Module C',
        capacityRetentionPercent: 36.7,
        electricalScore: 25,
        thermalScore: 18,
        usageScore: 20,
        circularityScore: 38,
        recommendation: 'RECYCLING',
        applicationCompatibility: {
          stationaryStorage: 15,
          ups: 10,
          solarStorage: 12,
          backupPower: 10,
        },
        reasoning: [
          '⚠ Severe capacity degradation (36.7% capacity retention).',
          '❌ Critical thermal elevation (+9.5°C rise, operating temp 46°C).',
          '❌ Physical pouch swelling recorded on Sub-Module C.',
          '➔ Recommended Pathway: RECYCLING — Material recovery for Cobalt, Lithium, and Nickel extraction.',
        ],
      },
    ],
    lifecycleHistory: [
      {
        id: 'lc-2050-1',
        batteryId: 'EVB-2050',
        timestamp: '2019-02-10',
        title: 'Cell Fabrication Completed',
        description: 'High-density NMC 622 pouch cells assembled.',
        stage: 'Manufactured',
        performedBy: 'LG Energy Solution',
      },
      {
        id: 'lc-2050-2',
        batteryId: 'EVB-2050',
        timestamp: '2026-10-04',
        title: 'CELLWISE Diagnostic Assessment',
        description: 'Score: 38 / 100. Routed directly to Recycling Queue.',
        stage: 'Assessment',
        performedBy: 'Marcus Miller',
      },
    ],
  },
  {
    id: 'EVB-2052',
    serialNumber: 'SN-CATL-LFP-30219',
    manufacturer: 'CATL',
    evModel: 'Hyundai Ioniq 5',
    chemistry: 'LFP',
    manufacturingYear: 2022,
    ratedCapacityAh: 55,
    currentCapacityAh: 32,
    nominalVoltageV: 49.0,
    location: 'Apex EV Service Centre (Testing Lab)',
    status: 'In Assessment',
    latestScore: 58,
    latestRecommendation: 'FURTHER TESTING',
    latestAssessmentDate: '2026-10-05',
    assessments: [
      {
        id: 'asm-2052-1',
        batteryId: 'EVB-2052',
        assessmentDate: '2026-10-05',
        technicianName: 'Elena Vance',
        ratedCapacityAh: 55,
        measuredCapacityAh: 32,
        voltageV: 49.0,
        currentA: 1.5,
        internalResistanceMOmega: 32,
        voltageDropV: 0.65,
        recoveryTimeSec: 3.1,
        operatingTempC: 36,
        tempRiseC: 5.2,
        thermalCondition: 'Elevated',
        ageYears: 4,
        cycleCount: 1100,
        previousApplication: 'Urban Taxi Fleet',
        knownDamage: false,
        capacityRetentionPercent: 58.2,
        electricalScore: 54,
        thermalScore: 58,
        usageScore: 62,
        circularityScore: 58,
        recommendation: 'FURTHER TESTING',
        applicationCompatibility: {
          stationaryStorage: 52,
          ups: 45,
          solarStorage: 50,
          backupPower: 48,
        },
        reasoning: [
          '⚠ Borderline capacity retention (58.2%).',
          '⚠ Elevated internal resistance (32 mΩ) and voltage drop (0.65V).',
          '➔ Recommended Pathway: FURTHER TESTING — Additional cell-level EIS analysis and balancing required before final routing decision.',
        ],
      },
    ],
    lifecycleHistory: [
      {
        id: 'lc-2052-1',
        batteryId: 'EVB-2052',
        timestamp: '2022-01-15',
        title: 'Pack Assembly',
        description: 'Cell-to-Pack LFP battery produced by CATL.',
        stage: 'Manufactured',
        performedBy: 'CATL',
      },
      {
        id: 'lc-2052-2',
        batteryId: 'EVB-2052',
        timestamp: '2026-10-05',
        title: 'Preliminary Diagnostic Run',
        description: 'Score: 58 / 100. Placed in Laboratory Testing Queue.',
        stage: 'Assessment',
        performedBy: 'Elena Vance',
      },
    ],
  },
  {
    id: 'EVB-1001',
    serialNumber: 'SN-BYD-LFP-11001',
    manufacturer: 'BYD',
    evModel: 'BYD Seal',
    chemistry: 'LFP',
    manufacturingYear: 2023,
    ratedCapacityAh: 70,
    currentCapacityAh: 62,
    nominalVoltageV: 52.1,
    location: 'VoltGrid Facility Alpha',
    status: 'In Reuse',
    latestScore: 89,
    latestRecommendation: 'REUSE',
    latestAssessmentDate: '2026-09-15',
    assessments: [
      {
        id: 'asm-1001-1',
        batteryId: 'EVB-1001',
        assessmentDate: '2026-09-15',
        technicianName: 'Chen Wei',
        ratedCapacityAh: 70,
        measuredCapacityAh: 62,
        voltageV: 52.1,
        currentA: 1.0,
        internalResistanceMOmega: 11,
        voltageDropV: 0.2,
        recoveryTimeSec: 0.8,
        operatingTempC: 27,
        tempRiseC: 1.5,
        thermalCondition: 'Normal',
        ageYears: 3,
        cycleCount: 420,
        previousApplication: 'Company Fleet Vehicle',
        knownDamage: false,
        capacityRetentionPercent: 88.6,
        electricalScore: 94,
        thermalScore: 96,
        usageScore: 88,
        circularityScore: 89,
        recommendation: 'REUSE',
        applicationCompatibility: {
          stationaryStorage: 96,
          ups: 92,
          solarStorage: 95,
          backupPower: 94,
        },
        reasoning: [
          '✓ Outstanding capacity retention (88.6%). Prime candidate for remanufactured vehicle application.',
          '✓ Ultra-low internal resistance (11 mΩ).',
          '➔ Recommended Pathway: REUSE — Remanufacturing or direct secondary EV deployment.',
        ],
      },
    ],
    lifecycleHistory: [
      {
        id: 'lc-1001-1',
        batteryId: 'EVB-1001',
        timestamp: '2023-03-10',
        title: 'Blade Battery Pack Assembled',
        description: 'BYD Blade LFP structure verified.',
        stage: 'Manufactured',
        performedBy: 'BYD Energy',
      },
      {
        id: 'lc-1001-2',
        batteryId: 'EVB-1001',
        timestamp: '2026-09-15',
        title: 'CELLWISE Assessment Passed',
        description: 'Score: 89 / 100. Allocated for EV Drivetrain Remanufacturing.',
        stage: 'Pathway Routing',
        performedBy: 'Chen Wei',
      },
    ],
  },
];

// Generate additional 26 realistic battery records to make total 30+
const manufacturers = ['Tesla', 'LG Energy', 'CATL', 'Panasonic', 'BYD', 'Samsung SDI', 'SK On'];
const models: Record<string, string[]> = {
  Tesla: ['Model 3', 'Model Y', 'Model S'],
  'LG Energy': ['Chevy Bolt EV', 'Audi e-tron', 'Porsche Taycan'],
  CATL: ['VW ID.4', 'BMW i4', 'NIO ET7'],
  Panasonic: ['Tesla Model S', 'Toyota bZ4X'],
  BYD: ['BYD Atto 3', 'BYD Han', 'BYD Seal'],
  'Samsung SDI': ['BMW iX', 'Rivian R1S'],
  'SK On': ['Hyundai Ioniq 5', 'Kia EV6', 'Ford F-150 Lightning'],
};

for (let i = 2; i <= 28; i++) {
  const num = 1000 + i;
  const bId = `EVB-${num}`;
  const mfr = manufacturers[i % manufacturers.length];
  const modelList = models[mfr] || ['EV Platform'];
  const evModel = modelList[i % modelList.length];
  const chemistry: 'LFP' | 'NMC' = i % 2 === 0 ? 'LFP' : 'NMC';
  const manufacturingYear = 2018 + (i % 6);
  const age = 2026 - manufacturingYear;
  const ratedCapacity = 40 + (i % 4) * 10;
  
  let retentionPct = 90 - (i * 2.1) + (i % 5) * 3;
  if (retentionPct > 94) retentionPct = 94;
  if (retentionPct < 30) retentionPct = 32;
  
  const measuredCapacity = Number(((ratedCapacity * retentionPct) / 100).toFixed(1));
  const cycleCount = 350 + i * 55;
  const ir = 10 + Math.round(i * 1.2);
  const temp = 25 + (i % 15);
  const tempRise = 1.5 + Number(((i % 8) * 0.8).toFixed(1));
  const thermalCond: ThermalCondition = tempRise > 7 ? 'Critical' : tempRise > 4.5 ? 'Elevated' : 'Normal';

  const calc = calculateCircularity({
    ratedCapacityAh: ratedCapacity,
    measuredCapacityAh: measuredCapacity,
    voltageV: 48.0 + (i % 5) * 0.5,
    currentA: 1.0 + (i % 3) * 0.5,
    internalResistanceMOmega: ir,
    voltageDropV: Number((0.2 + (i % 6) * 0.12).toFixed(2)),
    recoveryTimeSec: Number((1.0 + (i % 5) * 0.4).toFixed(1)),
    operatingTempC: temp,
    tempRiseC: tempRise,
    thermalCondition: thermalCond,
    ageYears: age,
    cycleCount: cycleCount,
    chemistry: chemistry,
    previousApplication: 'Passenger EV',
    knownDamage: i === 14 || i === 22,
    damageDescription: i === 14 ? 'Minor housing indentation' : i === 22 ? 'Micro-crack on terminal connector' : undefined,
  });

  let status: Battery['status'] = 'In Assessment';
  let recyclingStatus: RecyclingStatus | undefined = undefined;

  if (calc.recommendation === 'REUSE') {
    status = 'In Reuse';
  } else if (calc.recommendation === 'SECOND-LIFE') {
    status = i % 3 === 0 ? 'Allocated Second-Life' : 'Available Second-Life';
  } else if (calc.recommendation === 'RECYCLING') {
    status = i % 2 === 0 ? 'Processing Recycling' : 'Queued Recycling';
    recyclingStatus = i % 2 === 0 ? 'Processing' : 'Identified';
  }

  SEED_BATTERIES.push({
    id: bId,
    serialNumber: `SN-${mfr.substring(0, 3).toUpperCase()}-${chemistry}-${90000 + i}`,
    manufacturer: mfr,
    evModel: evModel,
    chemistry: chemistry,
    manufacturingYear: manufacturingYear,
    ratedCapacityAh: ratedCapacity,
    currentCapacityAh: measuredCapacity,
    nominalVoltageV: 48.0 + (i % 5) * 0.5,
    location: `EV Service Hub ${1 + (i % 4)}`,
    status: status,
    latestScore: calc.circularityScore,
    latestRecommendation: calc.recommendation,
    latestAssessmentDate: `2026-0${1 + (i % 9)}-${10 + (i % 18)}`,
    recyclingStatus: recyclingStatus,
    assessments: [
      {
        id: `asm-${num}-1`,
        batteryId: bId,
        assessmentDate: `2026-0${1 + (i % 9)}-${10 + (i % 18)}`,
        technicianName: 'Automated Diagnostic System',
        ratedCapacityAh: ratedCapacity,
        measuredCapacityAh: measuredCapacity,
        voltageV: 48.0 + (i % 5) * 0.5,
        currentA: 1.2,
        internalResistanceMOmega: ir,
        voltageDropV: Number((0.2 + (i % 6) * 0.12).toFixed(2)),
        recoveryTimeSec: Number((1.0 + (i % 5) * 0.4).toFixed(1)),
        operatingTempC: temp,
        tempRiseC: tempRise,
        thermalCondition: thermalCond,
        ageYears: age,
        cycleCount: cycleCount,
        previousApplication: 'Passenger EV',
        knownDamage: i === 14 || i === 22,
        capacityRetentionPercent: calc.capacityRetentionPercent,
        electricalScore: calc.electricalScore,
        thermalScore: calc.thermalScore,
        usageScore: calc.usageScore,
        circularityScore: calc.circularityScore,
        recommendation: calc.recommendation,
        applicationCompatibility: calc.applicationCompatibility,
        reasoning: calc.reasoning,
      },
    ],
    lifecycleHistory: [
      {
        id: `lc-${num}-1`,
        batteryId: bId,
        timestamp: `${manufacturingYear}-06-15`,
        title: 'Factory Quality Clearance',
        description: `Produced by ${mfr}`,
        stage: 'Manufactured',
        performedBy: mfr,
      },
      {
        id: `lc-${num}-2`,
        batteryId: bId,
        timestamp: `2026-0${1 + (i % 9)}-${10 + (i % 18)}`,
        title: 'CELLWISE Diagnostic Evaluation',
        description: `Circularity Score: ${calc.circularityScore}. Pathway: ${calc.recommendation}`,
        stage: 'Assessment',
        performedBy: 'Automated Inspector',
      },
    ],
  });
}

// Initial Second-Life Requests Seed
const SEED_REQUESTS: SecondLifeRequest[] = [
  {
    id: 'req-101',
    batteryId: 'EVB-2048',
    providerId: 'user-second-01',
    providerName: 'Marcus Brody',
    organization: 'VoltGrid Energy Solutions',
    targetApplication: 'Stationary Storage',
    quantityRequested: 1,
    deliveryLocation: 'Grid Substation Beta, Site 4',
    notes: 'Required for commercial solar peak-shaving project.',
    requestDate: '2026-10-06',
    status: 'Pending',
    updatedAt: '2026-10-06',
  },
];

// Initial Notifications Seed
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    timestamp: '2026-10-06 14:30',
    title: 'New Second-Life Request',
    message: 'VoltGrid requested EVB-2048 for Stationary Storage project.',
    targetRole: 'refurbisher',
    read: false,
    linkUrl: '/refurbisher/batteries',
  },
  {
    id: 'notif-2',
    timestamp: '2026-10-05 09:15',
    title: 'Recycling Candidate Received',
    message: 'EVB-2050 was queued for recycling material processing.',
    targetRole: 'recycler',
    read: false,
    linkUrl: '/recycler/batteries',
  },
];

export const dbService = {
  getBatteries(): Battery[] {
    const data = localStorage.getItem(DB_BATTERIES_KEY);
    if (!data) {
      localStorage.setItem(DB_BATTERIES_KEY, JSON.stringify(SEED_BATTERIES));
      return SEED_BATTERIES;
    }
    try {
      return JSON.parse(data) as Battery[];
    } catch {
      return SEED_BATTERIES;
    }
  },

  saveBatteries(batteries: Battery[]) {
    localStorage.setItem(DB_BATTERIES_KEY, JSON.stringify(batteries));
    if (dbChannel) dbChannel.postMessage({ type: 'batteries_updated' });
    window.dispatchEvent(new Event('cellwise_db_change'));
  },

  getBatteryById(id: string): Battery | undefined {
    const list = this.getBatteries();
    return list.find((b) => b.id.toLowerCase() === id.toLowerCase() || b.serialNumber.toLowerCase() === id.toLowerCase());
  },

  createBattery(
    identity: {
      id: string;
      serialNumber: string;
      manufacturer: string;
      evModel: string;
      chemistry: 'LFP' | 'NMC';
      manufacturingYear: number;
    },
    rawInput: RawAssessmentInput,
    technicianName: string = 'Service Technician'
  ): { battery: Battery; assessment: BatteryAssessment } {
    const list = this.getBatteries();
    const existing = list.find((b) => b.id.toLowerCase() === identity.id.toLowerCase());
    if (existing) {
      throw new Error(`Battery ID ${identity.id} already exists in database.`);
    }

    const calc = calculateCircularity(rawInput);
    const today = new Date().toISOString().split('T')[0];

    const newAssessment: BatteryAssessment = {
      id: `asm-${Date.now()}`,
      batteryId: identity.id,
      assessmentDate: today,
      technicianName,
      ratedCapacityAh: rawInput.ratedCapacityAh,
      measuredCapacityAh: rawInput.measuredCapacityAh,
      voltageV: rawInput.voltageV,
      currentA: rawInput.currentA,
      internalResistanceMOmega: rawInput.internalResistanceMOmega,
      voltageDropV: rawInput.voltageDropV,
      recoveryTimeSec: rawInput.recoveryTimeSec,
      operatingTempC: rawInput.operatingTempC,
      tempRiseC: rawInput.tempRiseC,
      thermalCondition: rawInput.thermalCondition,
      ageYears: rawInput.ageYears,
      cycleCount: rawInput.cycleCount,
      previousApplication: rawInput.previousApplication || 'EV Drivetrain',
      previousServiceNotes: rawInput.damageDescription,
      knownDamage: rawInput.knownDamage,
      capacityRetentionPercent: calc.capacityRetentionPercent,
      electricalScore: calc.electricalScore,
      thermalScore: calc.thermalScore,
      usageScore: calc.usageScore,
      circularityScore: calc.circularityScore,
      recommendation: calc.recommendation,
      applicationCompatibility: calc.applicationCompatibility,
      reasoning: calc.reasoning,
    };

    let status: Battery['status'] = 'In Assessment';
    let recyclingStatus: RecyclingStatus | undefined = undefined;

    if (calc.recommendation === 'REUSE') {
      status = 'In Reuse';
    } else if (calc.recommendation === 'SECOND-LIFE') {
      status = 'Available Second-Life';
    } else if (calc.recommendation === 'FURTHER TESTING') {
      status = 'In Assessment';
    } else if (calc.recommendation === 'RECYCLING') {
      status = 'Queued Recycling';
      recyclingStatus = 'Identified';
    }

    const newLifecycleEvents: LifecycleEvent[] = [
      {
        id: `lc-${Date.now()}-1`,
        batteryId: identity.id,
        timestamp: `${identity.manufacturingYear}-01-10`,
        title: 'Cell & Pack Manufacturing',
        description: `Produced by ${identity.manufacturer} (${identity.chemistry} chemistry).`,
        stage: 'Manufactured',
        performedBy: identity.manufacturer,
      },
      {
        id: `lc-${Date.now()}-2`,
        batteryId: identity.id,
        timestamp: today,
        title: 'CELLWISE Diagnostic Assessment',
        description: `Circularity score calculated: ${calc.circularityScore} / 100. Classified as ${calc.recommendation}.`,
        stage: 'Assessment',
        performedBy: technicianName,
      },
    ];

    const newBattery: Battery = {
      id: identity.id,
      serialNumber: identity.serialNumber,
      manufacturer: identity.manufacturer,
      evModel: identity.evModel,
      chemistry: identity.chemistry,
      manufacturingYear: identity.manufacturingYear,
      ratedCapacityAh: rawInput.ratedCapacityAh,
      currentCapacityAh: rawInput.measuredCapacityAh,
      nominalVoltageV: rawInput.voltageV,
      location: 'Apex EV Refurbishing Facility',
      status,
      latestScore: calc.circularityScore,
      latestRecommendation: calc.recommendation,
      latestAssessmentDate: today,
      recyclingStatus,
      assessments: [newAssessment],
      lifecycleHistory: newLifecycleEvents,
    };

    list.unshift(newBattery);
    this.saveBatteries(list);

    // Create system notifications
    if (calc.recommendation === 'SECOND-LIFE') {
      this.addNotification({
        title: 'New Second-Life Candidate Available',
        message: `Battery ${identity.id} (${identity.chemistry}) scored ${calc.circularityScore}/100 and is now available.`,
        targetRole: 'second_life',
        linkUrl: '/second-life/batteries',
      });
    } else if (calc.recommendation === 'RECYCLING') {
      this.addNotification({
        title: 'New Recycling Candidate Queued',
        message: `Battery ${identity.id} scored ${calc.circularityScore}/100 and was queued for recycling material recovery.`,
        targetRole: 'recycler',
        linkUrl: '/recycler/batteries',
      });
    }

    return { battery: newBattery, assessment: newAssessment };
  },

  getRequests(): SecondLifeRequest[] {
    const data = localStorage.getItem(DB_REQUESTS_KEY);
    if (!data) {
      localStorage.setItem(DB_REQUESTS_KEY, JSON.stringify(SEED_REQUESTS));
      return SEED_REQUESTS;
    }
    try {
      return JSON.parse(data) as SecondLifeRequest[];
    } catch {
      return SEED_REQUESTS;
    }
  },

  saveRequests(requests: SecondLifeRequest[]) {
    localStorage.setItem(DB_REQUESTS_KEY, JSON.stringify(requests));
    if (dbChannel) dbChannel.postMessage({ type: 'requests_updated' });
    window.dispatchEvent(new Event('cellwise_db_change'));
  },

  createSecondLifeRequest(
    batteryId: string,
    user: { id: string; name: string; organization: string },
    targetApplication: 'Stationary Storage' | 'UPS' | 'Solar Storage' | 'Backup Power',
    deliveryLocation: string,
    notes?: string
  ): SecondLifeRequest {
    const requests = this.getRequests();
    const today = new Date().toISOString().split('T')[0];

    const newReq: SecondLifeRequest = {
      id: `req-${Date.now()}`,
      batteryId,
      providerId: user.id,
      providerName: user.name,
      organization: user.organization,
      targetApplication,
      quantityRequested: 1,
      deliveryLocation,
      notes,
      requestDate: today,
      status: 'Pending',
      updatedAt: today,
    };

    requests.unshift(newReq);
    this.saveRequests(requests);

    // Update battery request count
    const batteries = this.getBatteries();
    const targetBattery = batteries.find((b) => b.id === batteryId);
    if (targetBattery) {
      targetBattery.requestCount = (targetBattery.requestCount || 0) + 1;
      this.saveBatteries(batteries);
    }

    this.addNotification({
      title: 'New Second-Life Battery Request',
      message: `${user.organization} submitted a request for battery ${batteryId} (${targetApplication}).`,
      targetRole: 'refurbisher',
      linkUrl: '/refurbisher/batteries',
    });

    return newReq;
  },

  updateRequestStatus(requestId: string, newStatus: RequestStatus) {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = newStatus;
    req.updatedAt = new Date().toISOString().split('T')[0];
    this.saveRequests(requests);

    const batteries = this.getBatteries();
    const b = batteries.find((bat) => bat.id === req.batteryId);

    if (b && newStatus === 'Approved') {
      b.status = 'Allocated Second-Life';
      b.lifecycleHistory.push({
        id: `lc-${Date.now()}`,
        batteryId: b.id,
        timestamp: req.updatedAt,
        title: 'Second-Life Allocation Approved',
        description: `Allocated to ${req.organization} for ${req.targetApplication}.`,
        stage: 'Pathway Routing',
        performedBy: 'Refurbisher Management',
        location: req.deliveryLocation,
      });
      this.saveBatteries(batteries);
    }

    this.addNotification({
      title: `Request ${newStatus}`,
      message: `Your request for ${req.batteryId} was updated to ${newStatus}.`,
      targetRole: 'second_life',
      linkUrl: '/second-life/dashboard',
    });
  },

  updateRecyclingStatus(batteryId: string, newStatus: RecyclingStatus) {
    const batteries = this.getBatteries();
    const b = batteries.find((bat) => bat.id === batteryId);
    if (!b) return;

    b.recyclingStatus = newStatus;
    if (newStatus === 'Completed') {
      b.status = 'Recycled';
    } else {
      b.status = 'Processing Recycling';
    }

    const today = new Date().toISOString().split('T')[0];
    b.lifecycleHistory.push({
      id: `lc-rec-${Date.now()}`,
      batteryId: b.id,
      timestamp: today,
      title: `Recycling Milestone: ${newStatus}`,
      description: `Battery state updated to ${newStatus} in pyrometallurgical & hydrometallurgical recovery line.`,
      stage: 'Recycling Process',
      performedBy: 'EcoMat Recycling Specialist',
    });

    this.saveBatteries(batteries);

    this.addNotification({
      title: 'Recycling Status Updated',
      message: `Battery ${batteryId} status changed to ${newStatus}.`,
      targetRole: 'admin',
      linkUrl: '/admin/dashboard',
    });
  },

  getNotifications(role?: UserRole): NotificationItem[] {
    const data = localStorage.getItem(DB_NOTIFICATIONS_KEY);
    let list: NotificationItem[] = [];
    if (!data) {
      localStorage.setItem(DB_NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      list = SEED_NOTIFICATIONS;
    } else {
      try {
        list = JSON.parse(data);
      } catch {
        list = SEED_NOTIFICATIONS;
      }
    }

    if (!role) return list;
    return list.filter((n) => n.targetRole === 'all' || n.targetRole === role);
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    list.unshift(newNotif);
    localStorage.setItem(DB_NOTIFICATIONS_KEY, JSON.stringify(list));
    if (dbChannel) dbChannel.postMessage({ type: 'notifications_updated' });
    window.dispatchEvent(new Event('cellwise_db_change'));
  },

  resetDatabaseToDefaults() {
    localStorage.setItem(DB_BATTERIES_KEY, JSON.stringify(SEED_BATTERIES));
    localStorage.setItem(DB_REQUESTS_KEY, JSON.stringify(SEED_REQUESTS));
    localStorage.setItem(DB_NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
    if (dbChannel) dbChannel.postMessage({ type: 'db_reset' });
    window.dispatchEvent(new Event('cellwise_db_change'));
  },
};
