export interface DashboardData {
  patientCounts: PatientCounts;
  highRiskCases: number;
  pendingReferralCount: number;
  todayFollowUps: number;
  upcomingAppointments: number;
  overdueCheckIns: number;
  engagementIssueCount: number;
  unverifiedFlagCount: number;
  recentPatients: RecentPatient[];
  recentActivity: ActivityItem[];
}

export interface PatientCounts {
  total: number;
  pending: number;
  verified: number;
  missedCheckIn: number;
  unreachable: number;
}

export interface RecentPatient {
  id: string;
  name: string;
  maternalId: string | null;
  verificationStatus: string;
  engagementStatus: string | null;
  lastActivityAt: string | null;
}

export interface ActivityItem {
  id: string;
  type: "registration" | "checkin" | "referral" | "alert";
  patientName: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  assignedMothers: number;
  highRiskCases: number;
  pendingFollowUps: number;
  referralsToday: number;
  weeklyCheckIns: number;
  upcomingAncVisits: number;
}

export interface RecentActivity {
  id: string;
  type: "registration" | "checkin" | "referral" | "hospital_accepted" | "followup";
  patientName: string;
  description: string;
  timestamp: string;
}

export interface HighRiskPatient {
  id: string;
  name: string;
  risk: "high" | "medium";
  symptoms: string[];
  timeReported: string;
  phone: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  hospital: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferralRequest {
  patientId: string;
  reason: string;
  hospital: string;
  notes?: string;
}

export interface ReportData {
  weeklyRegistrations: { week: string; count: number }[];
  riskDistribution: { label: string; value: number }[];
  followUpCompletion: { label: string; completed: number; pending: number }[];
  referralSuccess: { label: string; successful: number; failed: number }[];
}