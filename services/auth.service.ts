import { chewApi } from "./api";
import type { RegisterRequest, LoginRequest, TokenResponse } from "@/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await chewApi.post<TokenResponse>("/auth/register", {
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

  async login(data: LoginRequest): Promise<{ accessToken: string; refreshToken: string; user?: { verificationStatus: string } }> {
    const response = await chewApi.post("/auth/login", data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await chewApi.post<TokenResponse>("/auth/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await chewApi.post("/auth/logout", { refreshToken });
  }
}

export const authService = new AuthService();
