export type RiskLevel = "low" | "medium" | "high";
export type PatientStatus = "active" | "postpartum" | "transferred" | "discharged";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  pregnancyWeek?: number;
  edd?: string;
  risk: RiskLevel;
  language: string;
  phone: string;
  status: PatientStatus;
  lastCheckIn: string | null;
  assignedCHEW: string;
  lga: string;
  state: string;
  community?: string;
  registeredAt: string;
}

export interface PatientDetail extends Patient {
  address?: string;
  preferredChannel?: string;
  ward?: string;
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
