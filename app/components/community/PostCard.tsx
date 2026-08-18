"use client";

import Link from "next/link";
import { MessageCircle, Bookmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostView, ReactionType } from "@/lib/types/community";
import { POST_TYPE_LABELS, REACTION_LABELS } from "@/lib/types/community";
import { formatRelative } from "@/lib/community-format";
import { PaintedBoard } from "./PaintedBoard";
import { Stamp } from "./Stamp";

function reactionTotal(reactionCounts: PostView["reactionCounts"]): number {
  return Object.values(reactionCounts).reduce((a, b) => a + b, 0);
}

export function AuthorBadge({ badge, role }: { badge: string | null; role: string | null }) {
  if (!badge && !role) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-stamp)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        badge ? "bg-stamp-light text-stamp-dark" : "bg-paper-ink text-ink-faint",
      )}
    >
      <ShieldCheck className="h-2.5 w-2.5" />
      {badge ?? role}
    </span>
  );
}

export function PinDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute -top-1.5 left-4 h-3 w-3 rounded-full border border-white shadow-sm",
        className ?? "bg-gold",
      )}
    />
  );
}

interface PostCardProps {
  post: PostView;
  saved?: boolean;
  highlight?: boolean;
  index?: number;
}

export function PostCard({ post, saved, highlight, index = 0 }: PostCardProps) {
  const total = reactionTotal(post.reactionCounts);
  return (
    <div
      className={cn(
        "group relative block rounded-[var(--radius-stamp)] border border-line bg-white shadow-[var(--shadow-paper)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-stamp/40 hover:shadow-[var(--shadow-card-hover)]",
        highlight && "ring-1 ring-gold/40",
      )}
    >
      <PinDot className={index % 2 === 0 ? "bg-gold" : "bg-stamp"} />
      <div className="paper-ruled rounded-[var(--radius-stamp)] p-4 sm:p-5">
        <Link href={`/community/post/${post.id}`} className="block focus:outline-none">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <span className="text-ink/60">{POST_TYPE_LABELS[post.postType]}</span>
            <span aria-hidden className="text-line">/</span>
            <span>{post.author.displayName}</span>
            <span aria-hidden className="text-line">·</span>
            <span>{formatRelative(post.createdAt)}</span>
            {post.flagged && (
              <Stamp text="Flagged" tone="danger" className="ml-auto" />
            )}
          </div>

          <h3 className="mt-2 font-sans text-[15px] font-bold leading-snug text-ink group-hover:text-primary-dark sm:text-base">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">
            {post.body}
          </p>

          <div className="mt-3 flex items-center gap-3 border-t border-line/70 pt-3 font-mono text-[10px] text-ink-faint">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-stamp" />
              {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden>{Object.values(post.reactionCounts).length ? "💜" : "🤝"}</span>
              {total} {total === 1 ? "reaction" : "reactions"}
            </span>
            {saved && (
              <span className="ml-auto flex items-center gap-1 text-gold-dark">
                <Bookmark className="h-3.5 w-3.5 fill-gold text-gold" />
                saved
              </span>
            )}
          </div>
        </Link>

        {post.circle && (
          <div className="mt-3">
            <PaintedBoard
              name={post.circle.name}
              icon={post.circle.icon}
              href={`/community/circle/${post.circle.slug}`}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function reactionLabel(type: ReactionType): string {
  return REACTION_LABELS[type].label;
}
