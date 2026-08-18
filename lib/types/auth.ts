export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type UserRole =
  | "CHEW"
  | "ADMIN"
  | "SUPERVISOR"
  | "ORG_ADMIN"
  | "FACILITY_STAFF"
  | "PATIENT"
  | "CUSTOMER";

export interface OrganizationRef {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  state?: string;
  lga?: string | { id: string; name: string; state: { id: string; name: string } };
  facility?: string;
  preferredLanguage?: string;
  organizationId?: string;
  organizationName?: string;
  patient?: {
    id: string;
    maternalId?: string | null;
    age?: number | null;
    verificationStatus?: string;
    chew?: { id: string; name: string; phone: string } | null;
  } | null;
  createdAt?: string;
}