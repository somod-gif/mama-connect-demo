"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, BookHeart, MessageCircleQuestion, Stethoscope, ShieldAlert, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { communityService } from "@/lib/services/community.service";
import type { PostView } from "@/lib/types/community";
import { formatEventDate } from "@/lib/community-format";
import { PostCard } from "@/app/components/community/PostCard";
import { PaintedBoard } from "@/app/components/community/PaintedBoard";
import { Stamp } from "@/app/components/community/Stamp";

type FeedTab = "recommended" | "needsAnswer" | "professionals";

const tabMeta: Array<{ key: FeedTab; label: string; icon: typeof Compass }> = [
  { key: "recommended", label: "For you", icon: Compass },
  { key: "needsAnswer", label: "Needs an answer", icon: MessageCircleQuestion },
  { key: "professionals", label: "From professionals", icon: Stethoscope },
];

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-[var(--radius-stamp)] border border-line bg-white p-5 shadow-[var(--shadow-paper)]">
          <div className="h-2 w-1/3 rounded bg-paper-ink" />
          <div className="mt-3 h-4 w-3/4 rounded bg-paper-ink" />
          <div className="mt-2 h-3 w-full rounded bg-paper-ink" />
          <div className="mt-2 h-3 w-2/3 rounded bg-paper-ink" />
        </div>
      ))}
    </div>
  );
}

export default function CommunityHomePage() {
  const [tab, setTab] = useState<FeedTab>("recommended");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["community", "home"],
    queryFn: () => communityService.getHome(),
  });

  const feed: Array<{ key: FeedTab; posts: PostView[] }> = data
    ? ([
        { key: "recommended", posts: data.recommendedPosts },
        { key: "needsAnswer", posts: data.questionsNeedingAnswers },
        { key: "professionals", posts: data.professionalPosts },
      ] as Array<{ key: FeedTab; posts: PostView[] }>).filter((f) => f.posts.length > 0)
    : [];

  const activeTab = feed.find((f) => f.key === tab) ?? feed[0];
  const savedSet = new Set(data?.savedPostIds ?? []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {/* ---------------------------------------------------------- hero */}
      <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="absolute right-0 top-6 hidden rotate-2 sm:block" aria-hidden>
          <Stamp text="Peer support · not medical care" tone="amber" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stamp">
          Mama Circle · a moderated space
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          The circle is where mamas talk.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Ask, share and celebrate with other pregnant mamas and new mothers.
          Kind, moderated, and never a replacement for your CHEW.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/community/new"
            className="rounded-[var(--radius-stamp)] bg-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[var(--shadow-paper)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ask the circle
          </Link>
          <Link
            href="/community/guidelines"
            className="rounded-[var(--radius-stamp)] border border-line bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-soft transition-colors hover:bg-background-soft"
          >
            Read the guidelines
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------- body */}
      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr_260px]">
          <div className="animate-pulse space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-[var(--radius-stamp)] bg-secondary/10" />
            ))}
          </div>
          <FeedSkeleton />
          <div className="animate-pulse space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 rounded-[var(--radius-stamp)] border border-line bg-white" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-[var(--radius-stamp)] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          The circle is busy — we couldn&apos;t reach the community board. Refresh to try again.
        </div>
      )}

      {data && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr_260px]">
          {/* ------------------------------------------------ boards rail */}
          <aside className="order-2 lg:order-1" aria-label="Your circles">
            <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              My boards
            </h2>
            <div className="mt-3 space-y-2.5">
              {data.myCircles.map((c) => (
                <PaintedBoard
                  key={c.id}
                  name={c.name}
                  icon={c.icon}
                  href={`/community/circle/${c.slug}`}
                  size="sm"
                  className="w-full justify-center text-center"
                />
              ))}
            </div>
            {data.recommendedCircles.length > 0 && (
              <>
                <h2 className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  <span className="h-px flex-1 bg-line" />
                  Nearby boards
                </h2>
                <div className="mt-3 space-y-1">
                  {data.recommendedCircles.map((c) => (
                    <Link
                      key={c.id}
                      href={`/community/circle/${c.slug}`}
                      className="flex items-center gap-2 rounded-[var(--radius-stamp)] border border-line/60 bg-white px-3 py-2 text-xs font-semibold text-ink-soft transition-all hover:-translate-y-0.5 hover:border-stamp/40 hover:text-ink"
                    >
                      <span aria-hidden>{c.icon ?? "📍"}</span>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
            <Link
              href="/community/guidelines"
              className="mt-6 flex items-start gap-2 rounded-[var(--radius-stamp)] border border-amber-200 bg-amber-50 p-3 text-[11px] leading-snug text-amber-800 transition-colors hover:bg-amber-100"
            >
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              An emergency? Severe bleeding, seizures, blurred vision, reduced baby movement — call your CHEW or the hospital now, not the board.
            </Link>
          </aside>

          {/* --------------------------------------------------- feed */}
          <section className="order-1 lg:order-2" aria-label="Community feed">
            {feed.length > 1 && (
              <div className="mb-4 flex flex-wrap gap-1.5" role="tablist">
                {feed.map((f) => {
                  const meta = tabMeta.find((t) => t.key === f.key)!;
                  const active = activeTab?.key === f.key;
                  return (
                    <button
                      key={f.key}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(f.key)}
                      className={
                        active
                          ? "flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                          : "flex items-center gap-1.5 rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint hover:text-ink"
                      }
                    >
                      <meta.icon className="h-3 w-3" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            )}
            <motion.div key={activeTab?.key ?? "empty"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {activeTab ? (
                <div className="space-y-4">
                  {activeTab.posts.map((post, i) => (
                    <PostCard key={post.id} post={post} saved={savedSet.has(post.id)} index={i} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[var(--radius-stamp)] border border-dashed border-line bg-white p-10 text-center">
                  <BookHeart className="mx-auto h-8 w-8 text-stamp" />
                  <p className="mt-3 text-sm font-semibold text-ink">The board is quiet here.</p>
                  <p className="mt-1 text-xs text-ink-faint">Be the first to start a thread.</p>
                </div>
              )}
            </motion.div>
          </section>

          {/* ---------------------------------------------------- events */}
          <aside className="order-3" aria-label="Circle events and notices">
            <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              Upcoming
            </h2>
            {data.events.length === 0 ? (
              <p className="mt-3 rounded-[var(--radius-stamp)] border border-dashed border-line p-4 text-[11px] text-ink-faint">
                No events posted yet. Check back soon.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {data.events.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-[var(--radius-stamp)] border border-line/70 bg-white p-3.5 shadow-[var(--shadow-paper)]"
                  >
                    <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-stamp">
                      <CalendarDays className="h-3 w-3" />
                      {formatEventDate(e.startsAt)}
                    </p>
                    <p className="mt-1.5 text-[13px] font-bold leading-snug text-ink">{e.title}</p>
                    {e.description && (
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-soft">
                        {e.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              Languages
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(data.languages).map(([code, label]) => (
                <span
                  key={code}
                  className="rounded-[var(--radius-stamp)] bg-background-soft px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint"
                >
                  {label}
                </span>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
