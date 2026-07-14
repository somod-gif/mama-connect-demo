import type { RegisterRequest, User, TokenResponse } from "@/lib/types/auth";

const MOCK_USER: User = {
  id: "chew-001",
  name: "Abdul Suleiman",
  firstName: "Abdul",
  lastName: "Suleiman",
  email: "demo@mamaconnect.ng",
  phone: "+2348031234567",
  role: "chew",
};

export async function mockLogin(): Promise<TokenResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    accessToken: "mock-jwt-token-mamaconnect-2026-abc123",
    refreshToken: "mock-refresh-token-xyz789",
  };
}

export async function mockRegister(_registerData: RegisterRequest): Promise<TokenResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    accessToken: "mock-jwt-token-mamaconnect-2026-abc123",
    refreshToken: "mock-refresh-token-xyz789",
  };
}

export async function mockGetCurrentUser(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USER;
}
