import { api } from "@/lib/api";
import type { Referral, CreateReferralRequest } from "@/lib/types/dashboard";

class ReferralsService {
  async getReferrals(): Promise<Referral[]> {
    const response = await api.get<{ data: Referral[] }>("/chew/referrals");
    return response.data.data;
  }

  async createReferral(data: CreateReferralRequest): Promise<Referral> {
    const response = await api.post<{ data: Referral }>("/chew/referrals", data);
    return response.data.data;
  }
}

export const referralsService = new ReferralsService();
