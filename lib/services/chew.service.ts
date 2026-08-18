import { api } from "@/lib/api";
import type { OpenAlert } from "@/types/dashboard";
import type { DeliveryOrder } from "@/types/dashboard";
import type {
  BirthPlan,
  UpdateBirthPlanRequest,
} from "@/types/dashboard";

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

  async getDeliveries(history = false): Promise<DeliveryOrder[]> {
    const response = await api.get<{ data: DeliveryOrder[] }>(
      `/chew/deliveries${history ? "?history=true" : ""}`,
    );
    return response.data.data;
  }

  async markDelivered(orderId: string): Promise<DeliveryOrder> {
    const response = await api.post<{ data: DeliveryOrder }>(
      `/chew/deliveries/${orderId}/deliver`,
    );
    return response.data.data;
  }

  async getBirthPlan(patientId: string): Promise<BirthPlan | null> {
    const response = await api.get<{ data: BirthPlan | null }>(
      `/chew/patients/${patientId}/birth-plan`,
    );
    return response.data.data;
  }

  async updateBirthPlan(
    patientId: string,
    data: UpdateBirthPlanRequest,
  ): Promise<BirthPlan> {
    const response = await api.put<{ data: BirthPlan }>(
      `/chew/patients/${patientId}/birth-plan`,
      data,
    );
    return response.data.data;
  }

  async setBirthPlanItem(
    patientId: string,
    itemId: string,
    done: boolean,
  ): Promise<BirthPlan> {
    const response = await api.patch<{ data: BirthPlan }>(
      `/chew/patients/${patientId}/birth-plan/items/${itemId}`,
      { done },
    );
    return response.data.data;
  }
}

export const chewService = new ChewService();
