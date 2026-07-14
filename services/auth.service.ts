import { api } from "./api";
import type { RegisterRequest, LoginRequest, LoginResponse, TokenResponse } from "@/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      stateId: data.stateId,
      lgaId: data.lgaId,
      primaryHealthcareCentre: data.primaryHealthcareCentre,
      preferredLanguage: data.preferredLanguage,
    });
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  }

  async getMe(): Promise<{ role: string; verificationStatus: string }> {
    const response = await api.get("/auth/me");
    return response.data;
  }
}

export const authService = new AuthService();
