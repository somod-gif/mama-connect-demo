import type { VerificationStatus } from "./auth";

export interface AdminDashboardData {
  totalUsers: number;
  totalPatients: number;
  totalChews: number;
  pendingChews: number;
  pendingPatients: number;
  verifiedPatients: number;
  totalDocuments: number;
  pendingDocuments: number;
  recentActivity?: AdminActivityItem[];
}

export interface AdminActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface LgaRef {
  id: string;
  name: string;
  state?: { id: string; name: string };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  verificationStatus: VerificationStatus;
  lga: LgaRef | null;
  lgaId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPatient {
  id: string;
  userId: string;
  name: string;
  maternalId: string | null;
  phone: string | null;
  age: number | null;
  address: string | null;
  state: { id: string; name: string } | null;
  lga: { id: string; name: string } | null;
  stateId?: string;
  lgaId?: string;
  wardId?: string | null;
  chewId: string | null;
  preferredChannel: string | null;
  preferredLanguage: string | null;
  verificationStatus: VerificationStatus;
  chew: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  pregnancies: unknown[];
}

export interface AdminDocument {
  id: string;
  userId?: string;
  chewName: string;
  documentType: string;
  uploadDate: string;
  verificationStatus: VerificationStatus;
  previewUrl?: string;
  fileName?: string;
}

export interface VerifyRequest {
  status: "VERIFIED" | "REJECTED";
}

export interface VerifyPatientRequest {
  chewId: string;
}

export interface CreatePatientFromUserRequest {
  name: string;
  age: number;
  stateName: string;
  lgaName: string;
  chewId: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: string;
}

export interface UpdatePatientRequest {
  name?: string;
  age?: number;
  state?: string;
  lga?: string;
  address?: string;
  preferredLanguage?: string;
  preferredChannel?: string;
}

export interface VerifyDocumentRequest {
  action: "approve" | "reject";
}
