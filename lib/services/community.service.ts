import { api } from "@/lib/api";
import type {
  CircleDetail,
  CircleView,
  CircleType,
  CommentView,
  CommunityEvent,
  CommunityHome,
  CommunityReport,
  ModerationQueue,
  PostType,
  PostView,
  ReactionType,
  ReportReason,
  CreatePostResult,
} from "@/lib/types/community";

class CommunityService {
  async getHome(): Promise<CommunityHome> {
    const response = await api.get<CommunityHome>("/community/me/home");
    return response.data;
  }

  async listCircles(type?: CircleType): Promise<CircleView[]> {
    const response = await api.get<CircleView[]>("/community/circles", {
      params: type ? { type } : {},
    });
    return response.data;
  }

  async getCircle(slugOrId: string): Promise<CircleDetail> {
    const response = await api.get<CircleDetail>(
      `/community/circles/${slugOrId}`,
    );
    return response.data;
  }

  async joinCircle(id: string): Promise<void> {
    await api.post(`/community/circles/${id}/join`);
  }

  async leaveCircle(id: string): Promise<void> {
    await api.post(`/community/circles/${id}/leave`);
  }

  async listPosts(params?: {
    circleId?: string;
    sort?: "recent" | "popular" | "unanswered";
    q?: string;
    type?: string;
    before?: string;
    limit?: number;
  }): Promise<PostView[]> {
    const response = await api.get<PostView[]>("/community/posts", {
      params,
    });
    return response.data;
  }

  async getPost(id: string): Promise<PostView> {
    const response = await api.get<PostView>(`/community/posts/${id}`);
    return response.data;
  }

  async createPost(data: {
    circleId: string;
    title: string;
    body: string;
    postType?: PostType;
    isAnonymous?: boolean;
    language?: string;
    poll?: { options: string[] };
  }): Promise<CreatePostResult> {
    const response = await api.post<CreatePostResult>("/community/posts", data);
    return response.data;
  }

  async toggleSave(id: string): Promise<{ saved: boolean }> {
    const response = await api.post<{ saved: boolean }>(
      `/community/posts/${id}/save`,
    );
    return response.data;
  }

  async reactPost(id: string, type: ReactionType): Promise<void> {
    await api.post(`/community/posts/${id}/react`, { type });
  }

  async reactComment(id: string, type: ReactionType): Promise<void> {
    await api.post(`/community/comments/${id}/react`, { type });
  }

  async createComment(id: string, body: string): Promise<CommentView> {
    const response = await api.post<CommentView>(
      `/community/posts/${id}/comments`,
      { body },
    );
    return response.data;
  }

  async listComments(id: string): Promise<CommentView[]> {
    const response = await api.get<CommentView[]>(
      `/community/posts/${id}/comments`,
    );
    return response.data;
  }

  async getSummary(id: string): Promise<{ text: string | null; disclaimer: boolean }> {
    const response = await api.post<{ text: string | null; disclaimer: boolean }>(
      `/community/posts/${id}/summary`,
    );
    return response.data;
  }

  async setBestAnswer(
    id: string,
    commentId: string,
  ): Promise<{ id: string; isBestAnswer: boolean }> {
    const response = await api.post<{ id: string; isBestAnswer: boolean }>(
      `/community/posts/${id}/best-answer`,
      { commentId },
    );
    return response.data;
  }

  async translatePost(
    id: string,
    target: string,
  ): Promise<{ language: string; content: string; fromCache: boolean }> {
    const response = await api.post<{
      language: string;
      content: string;
      fromCache: boolean;
    }>(`/community/posts/${id}/translate`, { target });
    return response.data;
  }

  async translateComment(
    id: string,
    target: string,
  ): Promise<{ language: string; content: string; fromCache: boolean }> {
    const response = await api.post<{
      language: string;
      content: string;
      fromCache: boolean;
    }>(`/community/comments/${id}/translate`, { target });
    return response.data;
  }

  async createReport(data: {
    targetType: "POST" | "COMMENT";
    targetId: string;
    reason: ReportReason;
    details?: string;
  }): Promise<CommunityReport> {
    const response = await api.post<CommunityReport>("/community/reports", data);
    return response.data;
  }

  async getModerationQueue(): Promise<ModerationQueue> {
    const response = await api.get<ModerationQueue>("/community/moderation");
    return response.data;
  }

  async moderatePost(
    id: string,
    action: "approve" | "hide",
    note?: string,
  ): Promise<{ id: string; status: string }> {
    const response = await api.patch<{ id: string; status: string }>(
      `/community/moderation/posts/${id}/${action}`,
      note ? { note } : {},
    );
    return response.data;
  }

  async moderateComment(
    id: string,
    action: "approve" | "hide",
  ): Promise<{ id: string; status: string }> {
    const response = await api.patch<{ id: string; status: string }>(
      `/community/moderation/comments/${id}/${action}`,
    );
    return response.data;
  }

  async resolveReport(id: string): Promise<{ id: string; status: string }> {
    const response = await api.patch<{ id: string; status: string }>(
      `/community/moderation/reports/${id}/resolve`,
    );
    return response.data;
  }

  async listEvents(): Promise<CommunityEvent[]> {
    const response = await api.get<CommunityEvent[]>("/community/events");
    return response.data;
  }
}

export const communityService = new CommunityService();
