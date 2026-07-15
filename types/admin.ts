import type { VerificationStatus } from "./auth";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetail extends AdminUser {
  patient?: { id: string; maternalId: string | null; name: string; verificationStatus: string } | null;
  documents?: AdminDocument[];
}

export interface AdminPatientPregnancy {
  isActive: boolean;
  edd: string | null;
  lmp: string | null;
  gravida: number | null;
  parity: number | null;
  riskFactors: string | null;
  careStatus: string | null;
  engagementStatus: string | null;
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
  pregnancies: AdminPatientPregnancy[];
}

export interface AdminDocument {
  id: string;
  userId: string;
  type: string;
  url: string;
  publicId: string | null;
  verifiedAt: string | null;
  verifiedById: string | null;
  rejectedAt: string | null;
  rejectedById: string | null;
  createdAt: string;
  verificationStatus: VerificationStatus;
  user: { id: string; name: string | null; phone: string | null };
  verifiedBy: { id: string; name: string | null } | null;
  rejectedBy: { id: string; name: string | null } | null;
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
  stateId?: string;
  lgaId?: string;
  address?: string;
  preferredLanguage?: string;
  preferredChannel?: string;
}

export interface VerifyDocumentRequest {
  action: "approve" | "reject";
}
