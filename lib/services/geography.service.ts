import { api } from "@/lib/api";
import type { State, LGA, Ward } from "@/lib/types/geography";

class GeographyService {
  async getStates(): Promise<State[]> {
    const response = await api.get<State[]>("/geography/states");
    return response.data;
  }

  async getLGAs(stateId: string): Promise<LGA[]> {
    const response = await api.get<LGA[]>(`/geography/states/${stateId}/lgas`);
    return response.data;
  }

  async getWards(lgaId: string): Promise<Ward[]> {
    const response = await api.get<Ward[]>(`/geography/lgas/${lgaId}/wards`);
    return response.data;
  }
}

export const geographyService = new GeographyService();
