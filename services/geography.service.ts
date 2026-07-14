import { api } from "./api";
import type { State, LGA } from "@/types/geography";

class GeographyService {
  async getStates(): Promise<State[]> {
    const response = await api.get<State[]>("/geography/states");
    return response.data;
  }

  async getLGAs(stateId: string): Promise<LGA[]> {
    const response = await api.get<LGA[]>(`/geography/states/${stateId}/lgas`);
    return response.data;
  }
}

export const geographyService = new GeographyService();
