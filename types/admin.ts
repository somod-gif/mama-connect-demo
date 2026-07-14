import type { VerificationStatus } from "./auth";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalPatients: number;
  totalCHEWs: number;
  pendingCHEWs: number;
  pendingPatients: number;
  verifiedPatients: number;
  pendingDocuments: number;
  recentActivity: AdminActivityItem[];
}

export interface AdminActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminChewUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  primaryHealthcareCentre: string;
  preferredLanguage: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  photo?: string;
}

export interface AdminChewDetail extends AdminChewUser {
  role: string;
  updatedAt: string;
}

export interface AdminPatient {
  id: string;
  maternalId: string;
  firstName: string;
  lastName: string;
  assignedCHEW: string;
  verificationStatus: VerificationStatus;
  edd: string;
  state: string;
  lga: string;
}

export interface AdminDocument {
  id: string;
  chewName: string;
  documentType: string;
  uploadDate: string;
  verificationStatus: VerificationStatus;
  previewUrl?: string;
}

export interface VerifyRequest {
  status: "VERIFIED" | "REJECTED";
}
