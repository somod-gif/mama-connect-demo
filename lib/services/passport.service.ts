import { api } from "@/services/api";
import type { MaternalPassport, TimelineEvent } from "@/lib/types/passport";

class PassportService {
  async getMyPassport(): Promise<MaternalPassport> {
    const response = await api.get<MaternalPassport>("/patients/me/passport");
    return response.data;
  }

  async getMyTimeline(): Promise<TimelineEvent[]> {
    const response = await api.get<TimelineEvent[]>("/patients/me/timeline");
    return response.data;
  }
}

export const passportService = new PassportService();
