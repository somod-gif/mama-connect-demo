import type {
  DashboardStats,
  RecentActivity,
  HighRiskPatient,
  Referral,
  ReportData,
} from "@/lib/types/dashboard";

export async function mockGetDashboardStats(): Promise<DashboardStats> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    assignedMothers: 12,
    highRiskCases: 3,
    pendingFollowUps: 5,
    referralsToday: 2,
    weeklyCheckIns: 28,
    upcomingAncVisits: 4,
  };
}

export async function mockGetRecentActivity(): Promise<RecentActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: "act-001",
      type: "registration",
      patientName: "Hauwa Adamu",
      description: "New mother registered in the system",
      timestamp: "2 hours ago",
    },
    {
      id: "act-002",
      type: "checkin",
      patientName: "Amina Bello",
      description: "Weekly check-in completed. High risk detected.",
      timestamp: "3 hours ago",
    },
    {
      id: "act-003",
      type: "referral",
      patientName: "Grace Okonkwo",
      description: "Referred to Maraba General Hospital",
      timestamp: "5 hours ago",
    },
    {
      id: "act-004",
      type: "hospital_accepted",
      patientName: "Fatima Usman",
      description: "Referral accepted by Angwan Rimi PHC",
      timestamp: "1 day ago",
    },
    {
      id: "act-005",
      type: "followup",
      patientName: "Blessing John",
      description: "Postnatal follow-up completed. Mother and baby healthy.",
      timestamp: "1 day ago",
    },
    {
      id: "act-006",
      type: "checkin",
      patientName: "Mariam Bello",
      description: "Weekly check-in completed. Low risk.",
      timestamp: "2 days ago",
    },
  ];
}

export async function mockGetHighRiskPatients(): Promise<HighRiskPatient[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: "pat-001",
      name: "Amina Bello",
      risk: "high",
      symptoms: ["Severe headache", "Swollen feet", "Blurred vision"],
      timeReported: "10 minutes ago",
      phone: "+2348031111111",
    },
    {
      id: "pat-002",
      name: "Grace Okonkwo",
      risk: "high",
      symptoms: ["Reduced fetal movement", "Abdominal pain"],
      timeReported: "45 minutes ago",
      phone: "+2348032222222",
    },
    {
      id: "pat-003",
      name: "Zainab Mohammed",
      risk: "medium",
      symptoms: ["Mild swelling", "Fatigue"],
      timeReported: "2 hours ago",
      phone: "+2348033333333",
    },
  ];
}

export async function mockGetReferrals(): Promise<Referral[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: "ref-001",
      patientId: "pat-001",
      patientName: "Grace Okonkwo",
      hospital: "Maraba General Hospital",
      reason: "Reduced fetal movement - urgent evaluation needed",
      status: "pending",
      createdAt: "2026-07-12T08:30:00Z",
      updatedAt: "2026-07-12T08:30:00Z",
    },
    {
      id: "ref-002",
      patientId: "pat-002",
      patientName: "Fatima Usman",
      hospital: "Angwan Rimi PHC",
      reason: "Routine antenatal check-up",
      status: "accepted",
      createdAt: "2026-07-11T14:00:00Z",
      updatedAt: "2026-07-11T16:30:00Z",
    },
    {
      id: "ref-003",
      patientId: "pat-003",
      patientName: "Hauwa Adamu",
      hospital: "Karu General Hospital",
      reason: "Persistent vomiting - dehydration risk",
      status: "completed",
      createdAt: "2026-07-10T09:00:00Z",
      updatedAt: "2026-07-10T14:20:00Z",
    },
  ];
}

export async function mockGetReportData(): Promise<ReportData> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    weeklyRegistrations: [
      { week: "Jun 1", count: 3 },
      { week: "Jun 8", count: 5 },
      { week: "Jun 15", count: 2 },
      { week: "Jun 22", count: 7 },
      { week: "Jun 29", count: 4 },
      { week: "Jul 6", count: 6 },
    ],
    riskDistribution: [
      { label: "Low Risk", value: 7 },
      { label: "Medium Risk", value: 3 },
      { label: "High Risk", value: 2 },
    ],
    followUpCompletion: [
      { label: "Week 1", completed: 8, pending: 2 },
      { label: "Week 2", completed: 6, pending: 3 },
      { label: "Week 3", completed: 9, pending: 1 },
      { label: "Week 4", completed: 5, pending: 4 },
      { label: "Week 5", completed: 7, pending: 2 },
    ],
    referralSuccess: [
      { label: "Week 1", successful: 3, failed: 0 },
      { label: "Week 2", successful: 2, failed: 1 },
      { label: "Week 3", successful: 4, failed: 0 },
      { label: "Week 4", successful: 1, failed: 1 },
      { label: "Week 5", successful: 3, failed: 0 },
    ],
  };
}
