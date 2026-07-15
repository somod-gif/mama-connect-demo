import { api } from "./api";
import type {
  AdminDashboardData,
  AdminUser,
  AdminUserDetail,
  AdminPatient,
  AdminDocument,
  PaginatedResponse,
  VerifyRequest,
  VerifyPatientRequest,
  CreatePatientFromUserRequest,
  UpdateUserRequest,
  UpdatePatientRequest,
  VerifyDocumentRequest,
} from "@/types/admin";

interface ListUsersParams { role?: string; status?: string; q?: string; page?: number; limit?: number }
interface ListPatientsParams { status?: string; lgaId?: string; chewId?: string; q?: string; page?: number; limit?: number }
interface ListDocumentsParams { type?: string; verified?: string; userId?: string; q?: string; page?: number; limit?: number }

class AdminService {
  async getDashboard(): Promise<AdminDashboardData> {
    const response = await api.get("/admin/dashboard");
    return (response.data as { data: AdminDashboardData }).data;
  }

  async getUsers(params?: ListUsersParams): Promise<PaginatedResponse<AdminUser>> {
    const response = await api.get("/admin/users", { params });
    return response.data as PaginatedResponse<AdminUser>;
  }

  async getUser(id: string): Promise<AdminUserDetail> {
    const response = await api.get(`/admin/users/${id}`);
    return (response.data as { data: AdminUserDetail }).data;
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

  async getPatients(params?: ListPatientsParams): Promise<PaginatedResponse<AdminPatient>> {
    const response = await api.get("/admin/patients", { params });
    return response.data as PaginatedResponse<AdminPatient>;
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

  async getDocuments(params?: ListDocumentsParams): Promise<PaginatedResponse<AdminDocument>> {
    const response = await api.get("/admin/documents", { params });
    return response.data as PaginatedResponse<AdminDocument>;
  }

  async verifyDocument(id: string, data: VerifyDocumentRequest): Promise<void> {
    await api.post(`/admin/documents/${id}/verify`, data);
  }

  async getStates(): Promise<Array<{ id: string; name: string }>> {
    const response = await api.get("/geography/states");
    return response.data as Array<{ id: string; name: string }>;
  }

  async getLgas(stateId: string): Promise<Array<{ id: string; name: string }>> {
    const response = await api.get(`/geography/states/${stateId}/lgas`);
    return response.data as Array<{ id: string; name: string }>;
  }
}

export const adminService = new AdminService();
