
export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface OutbreakEvent {
  id: string;
  name: string;
  location: string;
  riskLevel: RiskLevel;
  description: string;
  dateDetected: string;
  affectedCount?: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

export interface Hotspot {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: string;
  description: string;
}

export interface GlobalStats {
  activeOutbreaks: number;
  monitoringCountries: number;
  aiConfidenceScore: number;
  highRiskCount: number;
}

export interface AnalysisResponse {
  markdownReport: string;
  hotspots: Hotspot[];
  sources: { uri: string; title: string }[];
  globalStats: GlobalStats;
}

export interface DiseaseInfo {
  name: string;
  symptoms: string[];
  transmission: string;
  prevention: string[];
}

export interface LocalAnalysisResponse {
  locationAlert: string;
  prediction7Day: string;
  healthProtocols: string[];
  riskLevel: string;
  immediateAction: string;
  sources: { uri: string; title: string }[];
  estimatedCaseCount?: number;
  detectedDiseases?: DiseaseInfo[];
  pastTrends?: string[];
  futureTrends?: string[];
}
