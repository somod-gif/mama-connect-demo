import { api } from "@/lib/api";
import type { Patient, PatientDetail, MedicalAttribute, RecordAttributeRequest } from "@/lib/types/patient";

class PatientsService {
  async getPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>("/chew/patients");
    return response.data;
  }

  async getUnassignedPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>("/chew/patients/unassigned");
    return response.data;
  }

  async getPatientById(id: string): Promise<PatientDetail> {
    const response = await api.get<PatientDetail>(`/chew/patients/${id}`);
    return response.data;
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
    const response = await api.get<MedicalAttribute[]>(`/chew/patients/${id}/attributes`);
    return response.data;
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
}

export const patientsService = new PatientsService();
