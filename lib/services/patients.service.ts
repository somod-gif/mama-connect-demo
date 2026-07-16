import { api } from "@/lib/api";
import type { Patient, PatientDetail, PatientCheckinsResponse, MedicalAttribute, RecordAttributeRequest } from "@/lib/types/patient";

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface QueryParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  engagement?: string;
  risk?: string;
  alerts?: string;
}

class PatientsService {
  async getPatients(params?: QueryParams): Promise<PaginatedResponse<Patient>> {
    const response = await api.get<PaginatedResponse<Patient>>("/chew/patients", { params });
    return response.data;
  }

  async getUnassignedPatients(params?: QueryParams): Promise<PaginatedResponse<Patient>> {
    const response = await api.get<PaginatedResponse<Patient>>("/chew/patients/unassigned", { params });
    return response.data;
  }

  async getPatientById(id: string): Promise<PatientDetail> {
    const response = await api.get(`/chew/patients/${id}`);
    return (response.data as { data: PatientDetail }).data;
  }

  async assignPatient(id: string): Promise<void> {
    await api.post(`/chew/patients/${id}/assign`);
  }

  async verifyPatient(id: string): Promise<void> {
    await api.post(`/chew/patients/${id}/verify`);
  }

  async updatePatient(id: string, data: Partial<PatientDetail>): Promise<void> {
    await api.patch(`/chew/patients/${id}`, data);
  }

  async getPatientAttributes(id: string): Promise<MedicalAttribute[]> {
    const response = await api.get(`/chew/patients/${id}/attributes`);
    return (response.data as { data: MedicalAttribute[] }).data;
  }

  async recordAttribute(id: string, data: RecordAttributeRequest): Promise<void> {
    await api.post(`/chew/patients/${id}/attributes`, data);
  }

  async getPatientSummaries(id: string): Promise<unknown[]> {
    const response = await api.get(`/chew/patients/${id}/summaries`);
    return response.data as unknown[];
  }

  async getTodaySummary(id: string): Promise<unknown> {
    const response = await api.get(`/chew/patients/${id}/summaries/today`);
    return response.data;
  }

  async getPatientCheckins(id: string): Promise<PatientCheckinsResponse> {
    const response = await api.get(`/chew/patients/${id}/checkins`);
    return (response.data as { data: PatientCheckinsResponse }).data;
  }
}

export const patientsService = new PatientsService();
