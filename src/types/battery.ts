export type UserRole = 'refurbisher' | 'second_life' | 'recycler' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
}

export type ChemistryType = 'LFP' | 'NMC';

export type PathwayRecommendation = 'REUSE' | 'SECOND-LIFE' | 'FURTHER TESTING' | 'RECYCLING';

export type ThermalCondition = 'Normal' | 'Elevated' | 'Critical';

export type ElectricalCondition = 'Excellent' | 'Good' | 'Acceptable' | 'Poor' | 'Critical';

export type RecyclingStatus = 'Identified' | 'Collection' | 'Received' | 'Processing' | 'Completed';

export type RequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';

export interface BatteryAssessment {
  id: string;
  batteryId: string;
  assessmentDate: string;
  technicianName: string;
  
  // Electrical Data
  ratedCapacityAh: number;
  measuredCapacityAh: number;
  voltageV: number;
  currentA: number;
  internalResistanceMOmega: number;
  voltageDropV: number;
  recoveryTimeSec: number;
  
  // Thermal Data
  operatingTempC: number;
  tempRiseC: number;
  thermalCondition: ThermalCondition;
  
  // History & Usage
  ageYears: number;
  cycleCount: number;
  previousApplication: string;
  previousServiceNotes?: string;
  knownDamage: boolean;
  damageDescription?: string;

  // Calculated Results
  capacityRetentionPercent: number;
  electricalScore: number;
  thermalScore: number;
  usageScore: number;
  circularityScore: number;
  recommendation: PathwayRecommendation;
  
  // Application Suitability percentages for Second-Life
  applicationCompatibility?: {
    stationaryStorage: number;
    ups: number;
    solarStorage: number;
    backupPower: number;
  };

  // Dynamic Bullet Reasons
  reasoning: string[];
}

export interface LifecycleEvent {
  id: string;
  batteryId: string;
  timestamp: string;
  title: string;
  description: string;
  stage: 'Manufactured' | 'EV Usage' | 'Service' | 'Assessment' | 'Pathway Routing' | 'Recycling Process';
  performedBy: string;
  location?: string;
}

export interface SecondLifeRequest {
  id: string;
  batteryId: string;
  providerId: string;
  providerName: string;
  organization: string;
  targetApplication: 'Stationary Storage' | 'UPS' | 'Solar Storage' | 'Backup Power';
  quantityRequested: number;
  deliveryLocation: string;
  notes?: string;
  requestDate: string;
  status: RequestStatus;
  updatedAt: string;
}

export interface Battery {
  id: string; // e.g. EVB-2048
  serialNumber: string;
  manufacturer: string; // Tesla, LG Energy, CATL, Panasonic, BYD, etc.
  evModel: string; // Model 3, ID.4, Ioniq 5, Leaf, etc.
  chemistry: ChemistryType;
  manufacturingYear: number;
  currentCapacityAh: number;
  ratedCapacityAh: number;
  nominalVoltageV: number;
  location: string;
  status: 'In Assessment' | 'Available Second-Life' | 'Allocated Second-Life' | 'Queued Recycling' | 'Processing Recycling' | 'Recycled' | 'In Reuse';
  
  // Latest assessment metrics
  latestScore: number;
  latestRecommendation: PathwayRecommendation;
  latestAssessmentDate: string;

  // Recycling progress if applicable
  recyclingStatus?: RecyclingStatus;

  // Requests count
  requestCount?: number;

  assessments: BatteryAssessment[];
  lifecycleHistory: LifecycleEvent[];
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  targetRole: UserRole | 'all';
  read: boolean;
  linkUrl?: string;
}
