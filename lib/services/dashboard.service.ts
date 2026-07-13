import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/types/dashboard";

class DashboardService {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>("/chew/dashboard");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
