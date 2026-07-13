import type { Patient, PatientCheckIn, PatientAlert } from "@/lib/types/patient";

export async function mockGetPatients(): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [
    {
      id: "pat-001",
      firstName: "Amina",
      lastName: "Bello",
      age: 24,
      pregnancyWeek: 32,
      edd: "2026-09-15",
      risk: "high",
      language: "Hausa",
      phone: "+2348031111111",
      status: "active",
      lastCheckIn: "2026-07-12T08:30:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-04-10T10:00:00Z",
    },
    {
      id: "pat-002",
      firstName: "Fatima",
      lastName: "Usman",
      age: 28,
      pregnancyWeek: 18,
      edd: "2026-12-20",
      risk: "low",
      language: "Hausa",
      phone: "+2348032222222",
      status: "active",
      lastCheckIn: "2026-07-11T14:00:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-05-05T09:00:00Z",
    },
    {
      id: "pat-003",
      firstName: "Grace",
      lastName: "Okonkwo",
      age: 31,
      pregnancyWeek: 36,
      edd: "2026-08-28",
      risk: "high",
      language: "Igbo",
      phone: "+2348033333333",
      status: "active",
      lastCheckIn: "2026-07-12T06:15:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-03-20T11:00:00Z",
    },
    {
      id: "pat-004",
      firstName: "Hauwa",
      lastName: "Adamu",
      age: 22,
      pregnancyWeek: 26,
      edd: "2026-10-30",
      risk: "low",
      language: "Pidgin",
      phone: "+2348034444444",
      status: "active",
      lastCheckIn: "2026-07-11T09:00:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-06-01T08:00:00Z",
    },
    {
      id: "pat-005",
      firstName: "Blessing",
      lastName: "John",
      age: 26,
      pregnancyWeek: 2,
      edd: "2026-07-05",
      risk: "low",
      language: "English",
      phone: "+2348035555555",
      status: "postpartum",
      lastCheckIn: "2026-07-10T11:00:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-01-15T14:00:00Z",
    },
    {
      id: "pat-006",
      firstName: "Zainab",
      lastName: "Mohammed",
      age: 29,
      pregnancyWeek: 24,
      edd: "2026-11-10",
      risk: "medium",
      language: "Hausa",
      phone: "+2348036666666",
      status: "active",
      lastCheckIn: "2026-07-10T07:00:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-05-20T10:00:00Z",
    },
    {
      id: "pat-007",
      firstName: "Mariam",
      lastName: "Bello",
      age: 30,
      pregnancyWeek: 14,
      edd: "2027-01-05",
      risk: "low",
      language: "Yoruba",
      phone: "+2348037777777",
      status: "active",
      lastCheckIn: "2026-07-09T16:00:00Z",
      assignedCHEW: "chew-001",
      lga: "Karu",
      state: "Nasarawa",
      registeredAt: "2026-06-15T12:00:00Z",
    },
  ];
}

export async function mockGetPatientById(id: string): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const patients = await mockGetPatients();
  const patient = patients.find((p) => p.id === id);
  if (!patient) throw new Error("Patient not found");
  return patient;
}

export async function mockGetPatientCheckIns(patientId: string): Promise<PatientCheckIn[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: `ci-${patientId}-1`,
      patientId,
      week: 24,
      responses: [
        { question: "How are you feeling today?", answer: "Good", flagged: false },
        { question: "Any swelling?", answer: "No", flagged: false },
        { question: "Any headache?", answer: "No", flagged: false },
      ],
      riskLevel: "low",
      completedAt: "2026-06-15T09:00:00Z",
    },
    {
      id: `ci-${patientId}-2`,
      patientId,
      week: 28,
      responses: [
        { question: "How are you feeling today?", answer: "Tired", flagged: false },
        { question: "Any swelling?", answer: "Mild", flagged: true },
        { question: "Any headache?", answer: "Sometimes", flagged: true },
      ],
      riskLevel: "medium",
      completedAt: "2026-07-01T10:00:00Z",
    },
  ];
}

export async function mockGetAlerts(): Promise<PatientAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: "alert-001",
      patientId: "pat-001",
      patientName: "Amina Bello",
      type: "high_risk",
      severity: "critical",
      message: "Severe headache and blurred vision reported. Immediate attention required.",
      createdAt: "2026-07-12T08:30:00Z",
      acknowledged: false,
    },
    {
      id: "alert-002",
      patientId: "pat-002",
      patientName: "Grace Okonkwo",
      type: "high_risk",
      severity: "critical",
      message: "Reduced fetal movement reported. Urgent evaluation needed.",
      createdAt: "2026-07-12T06:15:00Z",
      acknowledged: false,
    },
    {
      id: "alert-003",
      patientId: "pat-006",
      patientName: "Zainab Mohammed",
      type: "missed_checkin",
      severity: "warning",
      message: "Missed weekly check-in. 3 days overdue.",
      createdAt: "2026-07-11T00:00:00Z",
      acknowledged: true,
    },
    {
      id: "alert-004",
      patientId: "pat-007",
      patientName: "Blessing John",
      type: "overdue_followup",
      severity: "info",
      message: "Postnatal follow-up is due in 2 days.",
      createdAt: "2026-07-10T00:00:00Z",
      acknowledged: true,
    },
  ];
}
