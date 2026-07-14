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

export interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  role: string;
  verificationStatus: VerificationStatus;
  lga?: string | { id: string; name: string; state?: { id: string; name: string } };
  state?: string;
  createdAt: string;
  primaryHealthcareCentre?: string;
  preferredLanguage?: string;
}

export interface AdminPatient {
  id: string;
  maternalId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  assignedCHEW: string;
  assignedChewId?: string;
  verificationStatus: VerificationStatus;
  pregnancyStatus?: string;
  edd?: string;
  state: string;
  lga: string;
  age?: number;
  address?: string;
  preferredLanguage?: string;
  preferredChannel?: string;
}

export interface AdminDocument {
  id: string;
  chewName: string;
  documentType: string;
  uploadDate: string;
  verificationStatus: VerificationStatus;
  previewUrl?: string;
  userId?: string;
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
  firstName?: string;
  lastName?: string;
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
