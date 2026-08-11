"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Check, EyeOff, Ban, AlertTriangle, MessageCircle, Flag } from "lucide-react";
import { toast } from "sonner";
import { communityService } from "@/lib/services/community.service";
import { PROFESSIONAL_ROLES, REPORT_REASON_LABELS } from "@/lib/types/community";
import { formatRelative } from "@/lib/community-format";
import { Stamp } from "@/app/components/community/Stamp";
import { useAuthRole } from "@/hooks/use-auth-role";
import type { CommunityReport, ModComment, ModPost } from "@/lib/types/community";

function PostReviewCard({ post }: { post: ModPost }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (action: "approve" | "hide") => communityService.moderatePost(post.id, action),
    onSuccess: () => {
      toast.success(post.status === "FLAGGED" ? "Post reviewed" : "Post updated");
      queryClient.invalidateQueries({ queryKey: ["community", "moderation"] });
    },
    onError: () => toast.error("Could not update the post"),
  });

  return (
    <article className="rounded-[var(--radius-stamp)] border border-amber-200 bg-white p-4 shadow-[var(--shadow-paper)]">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
        {post.circle && (
          <span className="rounded-[var(--radius-stamp)] bg-secondary-light px-1.5 py-0.5 text-secondary">
            {post.circle.icon} {post.circle.name}
          </span>
        )}
        <span>{post.author?.name ?? "Unknown"}</span>
        <span aria-hidden className="text-line">·</span>
        <span>{formatRelative(post.createdAt)}</span>
        <Stamp text="Flagged" tone="amber" className="ml-auto" />
      </div>
      <h3 className="mt-2 text-[14px] font-bold leading-snug text-ink">{post.title}</h3>
      <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-ink-soft">{post.body}</p>
      {post.moderationCategory === "MISINFORMATION" && (
        <p className="mt-2 flex items-center gap-1.5 rounded-[var(--radius-stamp)] border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold text-sky-800">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          Under clinical review — possibly misleading health claims.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-line/70 pt-3">
        <button
          onClick={() => mutation.mutate("approve")}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-leaf px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-leaf-dark disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={() => mutation.mutate("hide")}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-rose-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-rose-700 disabled:opacity-50"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Hide
        </button>
        <Link
          href={`/community/post/${post.id}`}
          className="ml-auto rounded-[var(--radius-stamp)] border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft hover:bg-background-soft"
        >
          Open thread
        </Link>
      </div>
    </article>
  );
}

function CommentReviewCard({ comment }: { comment: ModComment }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (action: "approve" | "hide") => communityService.moderateComment(comment.id, action),
    onSuccess: () => {
      toast.success("Comment updated");
      queryClient.invalidateQueries({ queryKey: ["community", "moderation"] });
    },
    onError: () => toast.error("Could not update the comment"),
  });

  return (
    <article className="rounded-[var(--radius-stamp)] border border-amber-200 bg-white p-4 shadow-[var(--shadow-paper)]">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
        <MessageCircle className="h-3 w-3 text-ink-faint" />
        <span>{comment.author?.name ?? "Unknown"}</span>
        <span aria-hidden className="text-line">·</span>
        <span>{formatRelative(comment.createdAt)}</span>
        <Stamp text="Flagged" tone="amber" className="ml-auto" />
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ink">{comment.body}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint">
        on: {comment.postTitle ?? "a post"}
      </p>
      <div className="mt-3 flex gap-2 border-t border-line/70 pt-3">
        <button
          onClick={() => mutation.mutate("approve")}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-leaf px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-leaf-dark disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={() => mutation.mutate("hide")}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-rose-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-rose-700 disabled:opacity-50"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Hide
        </button>
      </div>
    </article>
  );
}

function ReportRow({ report }: { report: CommunityReport }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => communityService.resolveReport(report.id),
    onSuccess: () => {
      toast.success("Report resolved");
      queryClient.invalidateQueries({ queryKey: ["community", "moderation"] });
    },
    onError: () => toast.error("Could not resolve the report"),
  });

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-stamp)] border border-line bg-white p-4 shadow-[var(--shadow-paper)]">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--radius-stamp)] bg-rose-50">
        <Flag className="h-4 w-4 text-rose-600" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-ink">
          {REPORT_REASON_LABELS[report.reason]}
          <span className="ml-2 font-mono text-[9px] uppercase tracking-wide text-ink-faint">
            {report.targetType === "POST" ? "post" : "comment"}
          </span>
        </p>
        {report.details && <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-soft">{report.details}</p>}
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-ink-faint">
          reported by {report.reporter?.name ?? "a mama"} · {formatRelative(report.createdAt)}
        </p>
      </div>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="rounded-[var(--radius-stamp)] border border-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft hover:bg-background-soft disabled:opacity-50"
      >
        Mark resolved
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-[var(--radius-stamp)] border border-dashed border-line bg-white p-8 text-center text-[13px] text-ink-faint">
      {text}
    </p>
  );
}

export default function ModerationPage() {
  const { isAuthenticated, isLoading, role } = useAuthRole();
  const isPro = isAuthenticated && role ? PROFESSIONAL_ROLES.includes(role) : false;

  const { data, isLoading: queueLoading } = useQuery({
    queryKey: ["community", "moderation"],
    queryFn: () => communityService.getModerationQueue(),
    enabled: isPro,
  });

  if (isLoading) return null;

  if (!isPro) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <ShieldCheck className="mx-auto h-10 w-10 text-ink-faint" />
        <h1 className="mt-4 font-display text-3xl text-ink">The review wall is for professionals.</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-faint">
          Only verified CHEWs, supervisors and clinic staff can moderate the circle.
        </p>
        <Link
          href="/community"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.18em] text-stamp underline underline-offset-4"
        >
          Back to the circle
        </Link>
      </main>
    );
  }

  const total = (data?.flaggedPosts.length ?? 0) + (data?.flaggedComments.length ?? 0) + (data?.reports.length ?? 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-stamp)] bg-amber-100">
          <ShieldCheck className="h-5 w-5 text-amber-700" />
        </span>
        <div>
          <h1 className="font-display text-3xl leading-none text-ink">The review wall</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            {total} item{total === 1 ? "" : "s"} waiting for a human eye
          </p>
        </div>
      </div>

      <section className="mt-8" aria-label="Flagged posts">
        <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <Ban className="h-3.5 w-3.5 text-amber-600" />
          Flagged posts
        </h2>
        <div className="mt-3 space-y-3">
          {queueLoading ? (
            <EmptyState text="Loading the wall…" />
          ) : data?.flaggedPosts.length ? (
            data.flaggedPosts.map((p) => <PostReviewCard key={p.id} post={p} />)
          ) : (
            <EmptyState text="No flagged posts. The circle is behaving itself." />
          )}
        </div>
      </section>

      <section className="mt-8" aria-label="Flagged comments">
        <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <MessageCircle className="h-3.5 w-3.5 text-amber-600" />
          Flagged comments
        </h2>
        <div className="mt-3 space-y-3">
          {data?.flaggedComments.length ? (
            data.flaggedComments.map((c) => <CommentReviewCard key={c.id} comment={c} />)
          ) : (
            <EmptyState text="No flagged comments." />
          )}
        </div>
      </section>

      <section className="mt-8" aria-label="Reports">
        <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <Flag className="h-3.5 w-3.5 text-rose-600" />
          Open reports
        </h2>
        <div className="mt-3 space-y-3">
          {data?.reports.length ? (
            data.reports.map((r) => <ReportRow key={r.id} report={r} />)
          ) : (
            <EmptyState text="No open reports." />
          )}
        </div>
      </section>
    </main>
  );
}
