import { adminApi } from "./api";
import type { AdminDashboardData, AdminChewUser, AdminChewDetail, AdminPatient, AdminDocument, VerifyRequest } from "@/types/admin";
import type { TokenResponse } from "@/types/auth";

class AdminService {
  async login(data: { email: string; password: string }): Promise<TokenResponse> {
    const response = await adminApi.post<TokenResponse>("/admin/login", data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await adminApi.post<TokenResponse>("/auth/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await adminApi.post("/auth/logout", { refreshToken });
  }

  async getDashboard(): Promise<AdminDashboardData> {
    const response = await adminApi.get<AdminDashboardData>("/admin/dashboard");
    return response.data;
  }

  async getCHEWs(): Promise<AdminChewUser[]> {
    const response = await adminApi.get<AdminChewUser[]>("/admin/users");
    return response.data;
  }

  async getCHEWDetail(id: string): Promise<AdminChewDetail> {
    const response = await adminApi.get<AdminChewDetail>(`/admin/users/${id}`);
    return response.data;
  }

  async verifyCHEW(id: string, data: VerifyRequest): Promise<void> {
    await adminApi.post(`/admin/users/${id}/verify`, data);
  }

  async getPatients(): Promise<AdminPatient[]> {
    const response = await adminApi.get<AdminPatient[]>("/admin/patients");
    return response.data;
  }

  async verifyPatient(id: string): Promise<void> {
    await adminApi.post(`/admin/patients/${id}/verify`);
  }

  async getDocuments(): Promise<AdminDocument[]> {
    const response = await adminApi.get<AdminDocument[]>("/admin/documents");
    return response.data;
  }

  async verifyDocument(id: string, data: VerifyRequest): Promise<void> {
    await adminApi.post(`/admin/documents/${id}/verify`, data);
  }
}

export const adminService = new AdminService();
