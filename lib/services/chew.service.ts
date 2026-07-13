import { api } from "@/lib/api";

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
}

export const chewService = new ChewService();
