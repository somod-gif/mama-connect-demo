import { api } from "./api";
import type { RegisterRequest, LoginRequest, LoginResponse, TokenResponse, SetPasswordRequest, SetPasswordResponse, UpdateProfileRequest, ChangePasswordRequest, User } from "@/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const body: Record<string, string> = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    if (data.stateName) body.stateName = data.stateName;
    if (data.lgaName) body.lgaName = data.lgaName;
    if (data.facility) body.facility = data.facility;
    const response = await api.post<LoginResponse>("/auth/register", body);
    return response.data;
  }

  async setPassword(data: SetPasswordRequest): Promise<SetPasswordResponse> {
    const response = await api.post<SetPasswordResponse>("/auth/set-password", data);
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
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.patch<{ data: User }>("/auth/me", data);
    return response.data.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post("/auth/change-password", data);
  }
}

export const authService = new AuthService();
