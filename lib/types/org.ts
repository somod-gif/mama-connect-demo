export type OrgType = "NGO" | "GOV" | "CLINIC";
export type OrgTier = "TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";
export type OrgStatus = "TRIAL" | "ACTIVE" | "SUSPENDED";

export interface OrgProfile {
  id: string;
  name: string;
  type: OrgType;
  tier: OrgTier;
  status: OrgStatus;
  seatLimit: number;
  seatUsage: number;
  seatsRemaining: number;
  billingEmail: string | null;
  createdAt: string;
}

export interface OrgRegisterRequest {
  name: string;
  type: OrgType;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

export interface OrgRegisterResponse {
  org: { id: string; name: string; type: OrgType; tier: OrgTier };
  admin: { id: string; name: string; email: string };
  message: string;
}

export type InviteRole = "SUPERVISOR" | "CHEW" | "FACILITY_STAFF";

export interface InviteMemberRequest {
  name: string;
  email?: string;
  phone?: string;
  role: InviteRole;
}

export interface OrgMember {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  verificationStatus: string;
  createdAt: string;
}

export interface UpdateOrgRequest {
  name?: string;
  billingEmail?: string;
}
