import { chewApi } from "./api";

export interface ChewProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  lga?: string;
  primaryHealthcareCentre?: string;
  role?: string;
  preferredLanguage?: string;
  verificationStatus?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredLanguage?: string;
}

class ChewService {
  async getProfile(): Promise<ChewProfile> {
    const response = await chewApi.get<ChewProfile>("/users/me");
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await chewApi.patch("/users/profile", data);
  }

  async getDashboard(): Promise<unknown> {
    const response = await chewApi.get("/chew/dashboard");
    return response.data;
  }
}

export const chewService = new ChewService();
