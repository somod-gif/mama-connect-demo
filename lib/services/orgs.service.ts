import { api } from "@/services/api";
import type {
  InviteMemberRequest,
  OrgMember,
  OrgProfile,
  OrgRegisterRequest,
  OrgRegisterResponse,
  UpdateOrgRequest,
} from "@/lib/types/org";

class OrgsService {
  async register(data: OrgRegisterRequest): Promise<OrgRegisterResponse> {
    const response = await api.post<OrgRegisterResponse>("/orgs/register", data);
    return response.data;
  }

  async getMyOrg(): Promise<OrgProfile> {
    const response = await api.get<OrgProfile>("/orgs/me");
    return response.data;
  }

  async updateMyOrg(data: UpdateOrgRequest): Promise<OrgProfile> {
    const response = await api.patch<OrgProfile>("/orgs/me", data);
    return response.data;
  }

  async listMembers(): Promise<OrgMember[]> {
    const response = await api.get<OrgMember[]>("/orgs/me/members");
    return response.data;
  }

  async inviteMember(data: InviteMemberRequest): Promise<OrgMember> {
    const response = await api.post<OrgMember>("/orgs/invites", data);
    return response.data;
  }
}

export const orgsService = new OrgsService();
