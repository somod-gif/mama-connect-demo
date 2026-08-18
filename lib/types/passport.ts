export interface PassportIdentity {
  name: string;
  maternalId: string | null;
  age: number | null;
  phone: string;
  address: string | null;
  state: string | null;
  lga: string | null;
  ward: string | null;
}

export interface PassportPregnancy {
  gestationalAgeWeeks: number | null;
  trimester: 1 | 2 | 3 | null;
  edd: string | null;
  eddSource: string;
  riskFactors: string[];
  careStatus: string;
  engagementStatus: string;
}

export interface PassportAppointment {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
}

export interface PassportAlert {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  concern: string;
  status: string;
  createdAt: string;
}

export interface PassportAttribute {
  key: string;
  value: string | null;
  recordedAt: string;
}

export interface PassportCheckIn {
  interval: string;
  lastCheckInAt: string | null;
  nextCheckInAt: string;
}

export interface PassportChew {
  name: string;
  phone: string | null;
  facility: string | null;
}

export interface MaternalPassport {
  identity: PassportIdentity;
  pregnancy: PassportPregnancy | null;
  appointments: PassportAppointment[];
  alerts: PassportAlert[];
  attributes: {
    highlights: Record<string, string>;
    recent: PassportAttribute[];
  };
  checkIn: PassportCheckIn | null;
  chew: PassportChew | null;
}

export type TimelineEventType =
  | "HEALTH_RECORD"
  | "APPOINTMENT"
  | "ENCOUNTER"
  | "REFERRAL"
  | "ALERT"
  | "EDUCATION";

export interface TimelineEvent {
  type: TimelineEventType;
  date: string;
  summary: string;
}
