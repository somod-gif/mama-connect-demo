import { api } from "@/lib/api";
import type { LoginRequest, RegisterRequest, TokenResponse } from "@/lib/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/register", data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/login", data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  }
}

export const authService = new AuthService();
