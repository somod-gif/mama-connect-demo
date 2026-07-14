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

function unwrapArray<T>(response: unknown, key: string): T[] {
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object") {
    const obj = response as Record<string, unknown>;
    if (Array.isArray(obj[key])) return obj[key] as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
  }
  return [];
}

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

  async getUsers(params?: { role?: string; status?: string }): Promise<AdminUser[]> {
    const response = await api.get("/admin/users", { params });
    return unwrapArray<AdminUser>(response.data, "users");
  }

  async getUser(id: string): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
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
    return unwrapArray<AdminPatient>(response.data, "patients");
  }

  async getPatient(id: string): Promise<AdminPatient> {
    const response = await api.get<AdminPatient>(`/admin/patients/${id}`);
    return response.data;
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
    return unwrapArray<AdminDocument>(response.data, "documents");
  }

  async verifyDocument(id: string, data: VerifyDocumentRequest): Promise<void> {
    await api.post(`/admin/documents/${id}/verify`, data);
  }
}

export const adminService = new AdminService();
