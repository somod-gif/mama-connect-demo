import { api } from "./api";
import type { AdminDashboardData, AdminChewUser, AdminChewDetail, AdminPatient, AdminDocument, VerifyRequest } from "@/types/admin";
import type { TokenResponse } from "@/types/auth";

class AdminService {
  async login(data: { email: string; password: string }): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/admin/login", data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  }

  async getDashboard(): Promise<AdminDashboardData> {
    const response = await api.get<AdminDashboardData>("/admin/dashboard");
    return response.data;
  }

  async getCHEWs(): Promise<AdminChewUser[]> {
    const response = await api.get<AdminChewUser[]>("/admin/users");
    return response.data;
  }

  async getCHEWDetail(id: string): Promise<AdminChewDetail> {
    const response = await api.get<AdminChewDetail>(`/admin/users/${id}`);
    return response.data;
  }

  async verifyCHEW(id: string, data: VerifyRequest): Promise<void> {
    await api.post(`/admin/users/${id}/verify`, data);
  }

  async getPatients(): Promise<AdminPatient[]> {
    const response = await api.get<AdminPatient[]>("/admin/patients");
    return response.data;
  }

  async verifyPatient(id: string): Promise<void> {
    await api.post(`/admin/patients/${id}/verify`);
  }

  async getDocuments(): Promise<AdminDocument[]> {
    const response = await api.get<AdminDocument[]>("/admin/documents");
    return response.data;
  }

  async verifyDocument(id: string, data: VerifyRequest): Promise<void> {
    await api.post(`/admin/documents/${id}/verify`, data);
  }
}

export const adminService = new AdminService();
