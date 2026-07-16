import { api } from "@/lib/api";
import type { OpenAlert } from "@/types/dashboard";

interface ChewProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  lga?: string;
  ward?: string;
  primaryHealthcareCentre?: string;
  role?: string;
  preferredLanguage?: string;
  onboardingCompleted?: boolean;
}

interface UpdateProfileRequest {
  state?: string;
  lga?: string;
  ward?: string;
  primaryHealthcareCentre?: string;
  role?: string;
  preferredLanguage?: string;
}

class ChewService {
  async getProfile(): Promise<ChewProfile> {
    const response = await api.get<ChewProfile>("/users/me");
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await api.patch("/users/profile", data);
  }

  async getDashboard(): Promise<unknown> {
    const response = await api.get("/chew/dashboard");
    return response.data;
  }

  async acknowledgeAlert(id: string): Promise<void> {
    await api.patch(`/chew/alerts/${id}/acknowledge`);
  }

  async resolveAlert(id: string, note?: string): Promise<void> {
    await api.patch(`/chew/alerts/${id}/resolve`, note ? { note } : {});
  }

  async getAlerts(): Promise<OpenAlert[]> {
    const response = await api.get<{ data: OpenAlert[] }>("/chew/alerts");
    return response.data.data;
  }
}

export const chewService = new ChewService();
