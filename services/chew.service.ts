import { api } from "./api";

export interface LgaRef {
  id: string;
  name: string;
  state: { id: string; name: string };
}

export interface ChewProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  verificationStatus: string;
  facility?: string;
  lga?: LgaRef;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  facility?: string;
  preferredLanguage?: string;
}

class ChewService {
  async getProfile(): Promise<ChewProfile> {
    const response = await api.get<{ data: ChewProfile }>("/auth/me");
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await api.patch("/auth/me", data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post("/auth/change-password", data);
  }

  async getDashboard(): Promise<unknown> {
    const response = await api.get("/chew/dashboard");
    return response.data;
  }
}

export const chewService = new ChewService();
