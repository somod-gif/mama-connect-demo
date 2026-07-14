import { api } from "./api";
import type {
  AdminDashboardData,
  AdminUser,
  AdminPatient,
  AdminDocument,
  VerifyRequest,
  VerifyPatientRequest,
  CreatePatientFromUserRequest,
  UpdateUserRequest,
  UpdatePatientRequest,
  VerifyDocumentRequest,
} from "@/types/admin";
import type { TokenResponse } from "@/types/auth";

class AdminService {
  async login(data: { email: string; password: string }): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/login", data);
    return response.data;
  }

  async getDashboard(): Promise<AdminDashboardData> {
    const response = await api.get("/admin/dashboard");
    return (response.data as { data: AdminDashboardData }).data;
  }

  async getUsers(params?: { role?: string; status?: string }): Promise<AdminUser[]> {
    const response = await api.get("/admin/users", { params });
    return (response.data as { data: AdminUser[] }).data;
  }

  async getUser(id: string): Promise<AdminUser> {
    const response = await api.get(`/admin/users/${id}`);
    return (response.data as { data: AdminUser }).data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
    await api.patch(`/admin/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  async verifyUser(id: string, data: VerifyRequest): Promise<void> {
    await api.post(`/admin/users/${id}/verify`, data);
  }

  async getPatients(params?: { verificationStatus?: string; lga?: string; assignedCHEW?: string }): Promise<AdminPatient[]> {
    const response = await api.get("/admin/patients", { params });
    return (response.data as { data: AdminPatient[] }).data;
  }

  async updatePatient(id: string, data: UpdatePatientRequest): Promise<void> {
    await api.patch(`/admin/patients/${id}`, data);
  }

  async verifyPatient(id: string, data: VerifyPatientRequest): Promise<void> {
    await api.post(`/admin/patients/${id}/verify`, data);
  }

  async createPatientFromUser(id: string, data: CreatePatientFromUserRequest): Promise<void> {
    await api.post(`/admin/users/${id}/verify-patient`, data);
  }

  async getDocuments(): Promise<AdminDocument[]> {
    const response = await api.get("/admin/documents");
    return (response.data as { data: AdminDocument[] }).data;
  }

  async verifyDocument(id: string, data: VerifyDocumentRequest): Promise<void> {
    await api.post(`/admin/documents/${id}/verify`, data);
  }
}

export const adminService = new AdminService();
