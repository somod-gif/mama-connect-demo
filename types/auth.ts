export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  stateId: string;
  lgaId: string;
  primaryHealthcareCentre: string;
  preferredLanguage: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type UserRole = "chew" | "supervisor" | "staff" | "admin";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  verificationStatus?: VerificationStatus;
  state?: string;
  lga?: string;
  primaryHealthcareCentre?: string;
  preferredLanguage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}
