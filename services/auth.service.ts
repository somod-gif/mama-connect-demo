import { api } from "./api";
import type { RegisterRequest, LoginRequest, LoginResponse, TokenResponse, User } from "@/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", {
      email: data.identifier,
      password: data.password,
    });
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  }

  async getMe(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  }
}

export const authService = new AuthService();
