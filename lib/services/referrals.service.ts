import { api } from "@/lib/api";
import type { Referral, CreateReferralRequest } from "@/lib/types/dashboard";

class ReferralsService {
  async getReferrals(): Promise<Referral[]> {
    const response = await api.get<Referral[]>("/chew/referrals");
    return response.data;
  }

  async createReferral(data: CreateReferralRequest): Promise<Referral> {
    const response = await api.post<Referral>("/chew/referrals", data);
    return response.data;
  }
}

export const referralsService = new ReferralsService();
