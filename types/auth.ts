export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  stateId: string;
  lgaId: string;
  primaryHealthcareCentre: string;
  stateName?: string;
  lgaName?: string;
  facility?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    verificationStatus?: VerificationStatus;
    firstName?: string;
    lastName?: string;
  };
}

export type UserRole =
  | "CHEW"
  | "ADMIN"
  | "SUPERVISOR"
  | "ORG_ADMIN"
  | "FACILITY_STAFF"
  | "PATIENT"
  | "CUSTOMER";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}
