"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  Flag,
  Languages,
  Send,
  Sparkles,
  Check,
  Heart,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { communityService } from "@/lib/services/community.service";
import type { CommentView, PostView, ReactionType } from "@/lib/types/community";
import { REACTION_LABELS, REPORT_REASON_LABELS } from "@/lib/types/community";
import { formatMono } from "@/lib/community-format";
import { PaintedBoard } from "@/app/components/community/PaintedBoard";
import { Stamp } from "@/app/components/community/Stamp";
import { ThreadSpine } from "@/app/components/community/ThreadSpine";
import { AuthorBadge, PinDot } from "@/app/components/community/PostCard";
import { useAuth } from "@/hooks/useAuth";

const MY_POSTS_KEY = "mama_my_posts";

function myPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MY_POSTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function ReactionBar({ post }: { post: PostView }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (type: ReactionType) => communityService.reactPost(post.id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "post", post.id] });
    },
  });

  const total = Object.values(post.reactionCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(Object.keys(REACTION_LABELS) as ReactionType[]).map((type) => {
        const count = post.reactionCounts[type] ?? 0;
        const mine = post.myReactions.includes(type);
        return (
          <button
            key={type}
            onClick={() => mutation.mutate(type)}
            title={REACTION_LABELS[type].label}
            aria-pressed={mine}
            className={
              mine
                ? "flex items-center gap-1 rounded-[var(--radius-stamp)] border border-gold/50 bg-gold-light px-2 py-1 text-[11px] font-bold text-gold-dark"
                : "flex items-center gap-1 rounded-[var(--radius-stamp)] border border-line bg-white px-2 py-1 text-[11px] font-semibold text-ink-faint hover:border-stamp/40 hover:text-ink"
            }
          >
            <span aria-hidden>{REACTION_LABELS[type].emoji}</span>
            {count > 0 && <span className="font-mono text-[10px]">{count}</span>}
          </button>
        );
      })}
      <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-ink-faint">
        {total} {total === 1 ? "reaction" : "reactions"}
      </span>
    </div>
  );
}

function ReportPanel({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [reason, setReason] = useState<keyof typeof REPORT_REASON_LABELS>("DANGEROUS_ADVICE");
  const [details, setDetails] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      communityService.createReport({
        targetType: "POST",
        targetId: postId,
        reason,
        details: details.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Report sent — your circle keeps each other safe");
      onClose();
    },
    onError: () => toast.error("Could not send the report"),
  });

  return (
    <div className="mt-4 rounded-[var(--radius-stamp)] border border-rose-200 bg-rose-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Report this post</p>
      <label className="mt-3 block text-[11px] font-semibold text-ink-soft" htmlFor="report-reason">
        Why are you reporting it?
      </label>
      <select
        id="report-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value as keyof typeof REPORT_REASON_LABELS)}
        className="mt-1 w-full rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-2 text-sm text-ink focus:border-stamp focus:outline-none"
      >
        {(Object.keys(REPORT_REASON_LABELS) as Array<keyof typeof REPORT_REASON_LABELS>).map((r) => (
          <option key={r} value={r}>
            {REPORT_REASON_LABELS[r]}
          </option>
        ))}
      </select>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="Anything the moderators should know (optional)"
        className="mt-2 w-full rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-stamp focus:outline-none"
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-[var(--radius-stamp)] bg-rose-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50"
        >
          Send report
        </button>
        <button
          onClick={onClose}
          className="rounded-[var(--radius-stamp)] border border-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TranslateControl({ post }: { post: PostView }) {
  const [target, setTarget] = useState<string>("");
  const [view, setView] = useState<{ language: string; content: string } | null>(null);
  const mutation = useMutation({
    mutationFn: (lang: string) => communityService.translatePost(post.id, lang),
    onSuccess: (res) => {
      setView({ language: res.language, content: res.content });
    },
    onError: () => toast.error("Translation is not available right now"),
  });

  if (!target) {
    return (
      <div className="flex items-center gap-1.5">
        <Languages className="h-3.5 w-3.5 text-ink-faint" />
        <select
          value=""
          onChange={(e) => setTarget(e.target.value)}
          aria-label="Translate this post"
          className="rounded-[var(--radius-stamp)] border border-line bg-white px-2 py-1 text-[11px] font-semibold text-ink-soft focus:border-stamp focus:outline-none"
        >
          <option value="">Translate</option>
          <option value="ha">Hausa</option>
          <option value="yo">Yoruba</option>
          <option value="ig">Igbo</option>
          <option value="pcm">Pidgin</option>
        </select>
      </div>
    );
  }

  if (view) {
    return (
      <div className="mt-3 rounded-[var(--radius-stamp)] border border-stamp/30 bg-stamp-light/50 p-3">
        <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stamp-dark">
          <Languages className="h-3 w-3" />
          Translated to {target.toUpperCase()}
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{view.content}</p>
        <button
          onClick={() => setView(null)}
          className="mt-2 text-[11px] font-bold uppercase tracking-wide text-stamp underline underline-offset-2"
        >
          Show original
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate(target)}
      disabled={mutation.isPending}
      className="text-[11px] font-bold uppercase tracking-wide text-stamp underline underline-offset-2 disabled:opacity-50"
    >
      {mutation.isPending ? "Translating…" : `Translate to ${target.toUpperCase()}`}
    </button>
  );
}

function ThreadSummary({ post }: { post: PostView }) {
  const [text, setText] = useState<string | null>(post.summary);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await communityService.getSummary(post.id);
      setText(res.text);
      setShow(true);
    } catch {
      toast.error("Could not summarise the thread");
    } finally {
      setLoading(false);
    }
  };

  if (!show && !post.summary) {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft hover:border-stamp/40 hover:text-stamp disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? "Summarising…" : "Summarise the thread"}
      </button>
    );
  }

  return (
    <div className="rounded-[var(--radius-stamp)] border border-stamp/30 bg-stamp-light/50 p-4">
      <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stamp-dark">
        <Sparkles className="h-3 w-3" />
        MamaBot thread summary
        <Stamp text="Not medical advice" tone="amber" />
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink">
        {text ?? "The mamas here shared their experiences — read on for the full thread."}
      </p>
    </div>
  );
}

function CommentCard({
  comment,
  postId,
  isAuthor,
  index,
}: {
  comment: CommentView;
  postId: string;
  isAuthor: boolean;
  index: number;
}) {
  const queryClient = useQueryClient();
  const [translated, setTranslated] = useState<string | null>(null);

  const bestAnswerMutation = useMutation({
    mutationFn: () => communityService.setBestAnswer(postId, comment.id),
    onSuccess: () => {
      toast.success("Best answer marked");
      queryClient.invalidateQueries({ queryKey: ["community", "post", postId] });
    },
    onError: () => toast.error("Only the post author can mark the best answer"),
  });

  const reactMutation = useMutation({
    mutationFn: () => communityService.reactComment(comment.id, "SUPPORTIVE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "post"] });
    },
  });

  const translateMutation = useMutation({
    mutationFn: () => communityService.translateComment(comment.id, "en"),
    onSuccess: (res) => setTranslated(res.content),
    onError: () => toast.error("Translation is not available right now"),
  });

  return (
    <article
      className="relative z-10 rounded-[var(--radius-stamp)] border border-line bg-white p-4 shadow-[var(--shadow-paper)]"
      style={{ marginLeft: index % 2 === 1 ? "2.5rem" : "0.5rem", marginRight: index % 2 === 1 ? "0.5rem" : "2.5rem" }}
    >
      {comment.isBestAnswer && (
        <span className="absolute -top-2 right-3">
          <Stamp text="Best answer" tone="gold" />
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
        <span className="text-ink/60">{comment.author.displayName}</span>
        <AuthorBadge badge={comment.author.badge} role={comment.author.role} />
        <span aria-hidden className="text-line">·</span>
        <span>{formatMono(comment.createdAt)}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink">
        {translated ?? comment.body}
        {translated && (
          <button
            onClick={() => setTranslated(null)}
            className="ml-2 text-[10px] font-bold uppercase tracking-wide text-stamp underline underline-offset-2"
          >
            Original
          </button>
        )}
      </p>
      <div className="mt-2.5 flex items-center gap-3">
        <button
          onClick={() => reactMutation.mutate()}
          aria-pressed={comment.myReactions.includes("SUPPORTIVE")}
          className={
            comment.myReactions.includes("SUPPORTIVE")
              ? "flex items-center gap-1 text-[11px] font-bold text-rose-600"
              : "flex items-center gap-1 text-[11px] font-semibold text-ink-faint hover:text-rose-600"
          }
        >
          <Heart className={`h-3.5 w-3.5 ${comment.myReactions.includes("SUPPORTIVE") ? "fill-rose-500 text-rose-500" : ""}`} />
          Support
        </button>
        {comment.language && comment.language !== "en" && (
          <button
            onClick={() => translateMutation.mutate()}
            className="flex items-center gap-1 text-[11px] font-semibold text-ink-faint hover:text-stamp"
          >
            <Languages className="h-3 w-3" />
            {translateMutation.isPending ? "Translating…" : "Translate"}
          </button>
        )}
        {isAuthor && !comment.isBestAnswer && (
          <button
            onClick={() => bestAnswerMutation.mutate()}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gold-dark hover:underline"
          >
            <Check className="h-3 w-3" />
            Best answer
          </button>
        )}
      </div>
    </article>
  );
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["community", "post", id],
    queryFn: async () => {
      const [post, comments] = await Promise.all([
        communityService.getPost(id),
        communityService.listComments(id),
      ]);
      return { post, comments };
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => communityService.toggleSave(id),
    onSuccess: (res) => {
      setSaved(res.saved);
      queryClient.invalidateQueries({ queryKey: ["community", "post", id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => communityService.createComment(id, body.trim()),
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["community", "post", id] });
    },
    onError: () => toast.error("Could not post your comment"),
  });

  const topLevel = useMemo(
    () => data?.comments.filter((c) => !c.parentId) ?? [],
    [data],
  );

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="h-40 animate-pulse rounded-[var(--radius-stamp)] border border-line bg-white" />
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[var(--radius-stamp)] border border-line bg-white" />
          ))}
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-4xl" aria-hidden>🕯️</p>
        <h1 className="mt-3 font-display text-3xl text-ink">This thread is gone.</h1>
        <p className="mt-2 text-sm text-ink-faint">It was removed or never existed.</p>
        <Link href="/community" className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.18em] text-stamp underline underline-offset-4">
          Back to the circle
        </Link>
      </main>
    );
  }

  const { post } = data;
  const isAuthor = myPosts().includes(post.id) || user?.role === "ADMIN";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href={post.circle ? `/community/circle/${post.circle.slug}` : "/community"}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint hover:text-stamp"
        >
          <ArrowLeft className="h-3 w-3" />
          {post.circle ? post.circle.name : "The circle"}
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => saveMutation.mutate()}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gold-dark hover:underline"
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-gold text-gold" : ""}`} />
            Save
          </button>
          <button
            onClick={() => setShowReport((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 hover:underline"
          >
            <Flag className="h-3.5 w-3.5" />
            Report
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------- post */}
      <article className="relative mt-4 rounded-[var(--radius-stamp)] border border-line bg-white shadow-[var(--shadow-paper)]">
        <PinDot className="bg-gold" />
        <div className="paper-ruled rounded-[var(--radius-stamp)] p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
            <span className="text-ink/60">{post.postType}</span>
            <AuthorBadge badge={post.author.badge} role={post.author.role} />
            <span aria-hidden className="text-line">·</span>
            <span>{post.author.displayName}</span>
            <span aria-hidden className="text-line">·</span>
            <span>{formatMono(post.createdAt)}</span>
            <span className="ml-auto flex gap-1.5">
              {post.flagged && <Stamp text="Flagged" tone="rose" />}
              {post.status === "PENDING" && <Stamp text="Reviewing" tone="amber" />}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl leading-tight text-ink sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-soft">
            {post.body}
          </p>

          {post.poll && (
            <div className="mt-5 rounded-[var(--radius-stamp)] border border-gold/30 bg-gold-light/60 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold-dark">Poll</p>
              <div className="mt-2.5 space-y-2">
                {post.poll.options.map((opt, i) => {
                  const votes = post.poll?.votes[opt] ?? 0;
                  const total = Object.values(post.poll?.votes ?? {}).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 text-right font-mono text-[10px] text-ink-faint">{i + 1}.</span>
                      <div className="relative h-7 flex-1 overflow-hidden rounded-[var(--radius-stamp)] border border-line bg-white">
                        <div
                          className="h-full bg-gold/20 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute inset-y-0 left-2.5 flex items-center text-[12px] font-semibold text-ink">
                          {opt}
                        </span>
                      </div>
                      <span className="w-10 text-left font-mono text-[10px] text-ink-faint">{votes}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-[10px] text-gold-dark/80">Votes are shared in the comments below.</p>
            </div>
          )}

          <div className="mt-5 border-t border-line/70 pt-4">
            <ReactionBar post={post} />
          </div>

          {showReport && <ReportPanel postId={post.id} onClose={() => setShowReport(false)} />}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <TranslateControl post={post} />
            <ThreadSummary post={post} />
          </div>

          {post.circle && (
            <div className="mt-5">
              <PaintedBoard name={post.circle.name} icon={post.circle.icon} href={`/community/circle/${post.circle.slug}`} size="sm" />
            </div>
          )}
        </div>
      </article>

      {/* ---------------------------------------------------- comments */}
      <section className="relative mt-10" aria-label="Comments">
        <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <MessageCircle className="h-3.5 w-3.5 text-stamp" />
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"} on the thread
        </h2>

        <div className="relative mt-6">
          {topLevel.length > 0 && <ThreadSpine commentCount={topLevel.length} />}
          <div className="space-y-6">
            {topLevel.length === 0 && (
              <div className="relative z-10 rounded-[var(--radius-stamp)] border border-dashed border-line bg-white p-8 text-center">
                <p className="text-2xl" aria-hidden>🧵</p>
                <p className="mt-2 text-sm font-semibold text-ink">No comments yet — start the thread.</p>
              </div>
            )}
            {topLevel.map((comment, i) => {
              const replies = data.comments.filter((c) => c.parentId === comment.id);
              return (
                <div key={comment.id}>
                  <CommentCard comment={comment} postId={post.id} isAuthor={isAuthor} index={i} />
                  {replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-6">
                      {replies.map((reply, j) => (
                        <CommentCard key={reply.id} comment={reply} postId={post.id} isAuthor={isAuthor} index={i + j + 1} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* comment form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (body.trim().length >= 2) commentMutation.mutate();
          }}
          className="relative z-10 mt-10 rounded-[var(--radius-stamp)] border border-line bg-white p-4 shadow-[var(--shadow-paper)]"
        >
          <label htmlFor="comment-body" className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
            Join the thread
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Share your experience, kindly — no diagnosing, no shaming."
            className="mt-2 w-full resize-none rounded-[var(--radius-stamp)] border border-line bg-background-soft px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-faint focus:border-stamp focus:bg-white focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">
              {body.length}/2000
            </p>
            <button
              type="submit"
              disabled={body.trim().length < 2 || commentMutation.isPending}
              className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[var(--shadow-paper)] transition-all hover:-translate-y-0.5 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {commentMutation.isPending ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
