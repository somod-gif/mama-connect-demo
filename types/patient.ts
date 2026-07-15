export type RiskLevel = "low" | "medium" | "high";
export type PatientStatus = "active" | "postpartum" | "transferred" | "discharged";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface PatientPregnancy {
  id: string;
  lmp: string | null;
  edd: string | null;
  gravida: number | null;
  parity: number | null;
  riskFactors: string | null;
  careStatus: string | null;
  engagementStatus: string | null;
  isActive: boolean;
}

export interface Patient {
  id: string;
  name: string;
  maternalId: string | null;
  phone: string;
  age: number | null;
  address: string | null;
  preferredChannel: string;
  preferredLanguage: string | null;
  verificationStatus: VerificationStatus;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
  stateId: string;
  lgaId: string;
  wardId: string | null;
  chewId: string | null;
  state: { id: string; name: string; code: string };
  lga: { id: string; name: string };
  ward: { id: string; name: string } | null;
  chew: { id: string; name: string; phone: string } | null;
  user: { id: string; name: string; phone: string; role: string };
  pregnancies: PatientPregnancy[];
}

export interface PatientDetail extends Patient {
  todaySummary?: unknown;
  recentSummaries?: unknown[];
}

export interface PatientCheckIn {
  id: string;
  patientId: string;
  week: number;
  responses: CheckInResponse[];
  riskLevel: RiskLevel;
  completedAt: string;
}

export interface CheckInResponse {
  question: string;
  answer: string;
  flagged: boolean;
}

export interface PatientAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: "high_risk" | "missed_checkin" | "overdue_followup" | "emergency";
  severity: "critical" | "warning" | "info";
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface MedicalAttribute {
  id: string;
  type: string;
  value: string;
  unit: string;
  recordedAt: string;
  recordedBy: string;
}

export interface RecordAttributeRequest {
  type: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface PatientCheckinsResponse {
  schedule: {
    id: string;
    patientId: string;
    dayOfWeek: string;
    timeOfDay: string;
    isActive: boolean;
    consecutiveMissed: number;
    lastCheckInAt: string | null;
    nextCheckInAt: string | null;
  } | null;
  healthRecords: Array<{
    id: string;
    type: string;
    value: string;
    unit: string | null;
    notes: string | null;
    recordedAt: string;
    recordedBy: string | null;
  }>;
}
