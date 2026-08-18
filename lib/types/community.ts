export type PostType =
  | "ASK"
  | "SHARE"
  | "SUPPORT"
  | "CELEBRATE"
  | "POLL"
  | "RECOMMENDATION";

export type ReactionType =
  | "HELPED_ME"
  | "HELPFUL"
  | "SUPPORTIVE"
  | "INFORMATIVE"
  | "CELEBRATE"
  | "PRAY";

export type ReportReason =
  | "MISINFORMATION"
  | "HARASSMENT"
  | "ABUSE"
  | "SCAM"
  | "DANGEROUS_ADVICE"
  | "INAPPROPRIATE"
  | "PRIVACY"
  | "OTHER";

export type CircleType =
  | "STAGE"
  | "EXPERIENCE"
  | "TOPIC"
  | "DUE_DATE"
  | "LOCATION"
  | "PROFESSIONAL";

export type CircleStage =
  | "FIRST_TRIMESTER"
  | "SECOND_TRIMESTER"
  | "THIRD_TRIMESTER"
  | "POSTPARTUM"
  | "NEWBORN_CARE";

export interface CommunityAuthor {
  displayName: string;
  badge: string | null;
  role: string | null;
}

export interface CircleView {
  id: string;
  name: string;
  slug: string;
  type: CircleType;
  stage: CircleStage | null;
  icon: string | null;
  description?: string | null;
}

export interface CircleDetail extends CircleView {
  sortOrder: number;
  _count: { members: number; posts: number };
}

export interface PostPoll {
  options: string[];
  votes: Record<string, number>;
}

export interface PostView {
  id: string;
  circle: CircleView | null;
  title: string;
  body: string;
  postType: PostType;
  language: string;
  translations: Record<string, string>;
  status: string;
  aiRisk: string | null;
  flagged: boolean;
  moderationNote: string | null;
  isPinned: boolean;
  commentCount: number;
  reactionCounts: Partial<Record<ReactionType, number>>;
  myReactions: ReactionType[];
  poll: PostPoll | null;
  summary: string | null;
  author: CommunityAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CommentView {
  id: string;
  body: string;
  language: string;
  isBestAnswer: boolean;
  parentId: string | null;
  status: string;
  myReactions: ReactionType[];
  author: CommunityAuthor;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  circleId: string | null;
  title: string;
  description: string | null;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
}

export interface CommunityGuideline {
  rule: string;
  detail: string;
}

export interface CommunityHome {
  guidelines: CommunityGuideline[];
  languages: Record<string, string>;
  myCircles: CircleView[];
  recommendedCircles: CircleView[];
  recommendedPosts: PostView[];
  questionsNeedingAnswers: PostView[];
  professionalPosts: PostView[];
  events: CommunityEvent[];
  savedPostIds: string[];
}

export interface ModPost {
  id: string;
  title: string;
  body: string;
  status: string;
  aiRisk: string | null;
  moderationCategory: string | null;
  moderationNote: string | null;
  circle: { name: string; slug: string; icon: string | null } | null;
  author: { id: string; name: string | null; role: string } | null;
  createdAt: string;
}

export interface ModComment {
  id: string;
  body: string;
  postId: string;
  postTitle: string | null;
  author: { id: string; name: string | null; role: string } | null;
  createdAt: string;
}

export interface CommunityReport {
  id: string;
  targetType: "POST" | "COMMENT";
  reason: ReportReason;
  details: string | null;
  status: string;
  reporter: { id: string; name: string | null; role: string } | null;
  createdAt: string;
}

export interface ModerationQueue {
  flaggedPosts: ModPost[];
  flaggedComments: ModComment[];
  reports: CommunityReport[];
}

export interface CreatePostResult {
  post: PostView | { id: string; status: string; aiRisk: string | null; moderationNote: string | null };
  guidance: string | null;
  escalated: boolean;
}

export const REACTION_LABELS: Record<ReactionType, { label: string; emoji: string }> = {
  HELPED_ME: { label: "Helped me", emoji: "🤝" },
  HELPFUL: { label: "Helpful", emoji: "👍" },
  SUPPORTIVE: { label: "Supportive", emoji: "💜" },
  INFORMATIVE: { label: "Informative", emoji: "📘" },
  CELEBRATE: { label: "Celebrate", emoji: "🎉" },
  PRAY: { label: "Pray", emoji: "🙏" },
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  ASK: "Ask",
  SHARE: "Share",
  SUPPORT: "Support",
  CELEBRATE: "Celebrate",
  POLL: "Poll",
  RECOMMENDATION: "Recommendation",
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  MISINFORMATION: "Misinformation",
  HARASSMENT: "Harassment",
  ABUSE: "Abuse",
  SCAM: "Scam",
  DANGEROUS_ADVICE: "Dangerous advice",
  INAPPROPRIATE: "Inappropriate",
  PRIVACY: "Privacy",
  OTHER: "Other",
};

export const PROFESSIONAL_ROLES = ["CHEW", "SUPERVISOR", "FACILITY_STAFF", "ORG_ADMIN"];
