"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, PenLine, ArrowLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { communityService } from "@/lib/services/community.service";
import { PostCard } from "@/app/components/community/PostCard";
import { PaintedBoard } from "@/app/components/community/PaintedBoard";
import { Stamp } from "@/app/components/community/Stamp";

export default function CirclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["community", "circle", slug],
    queryFn: async () => {
      const circle = await communityService.getCircle(slug);
      const [home, posts] = await Promise.all([
        communityService.getHome(),
        communityService.listPosts({ circleId: circle.id, limit: 50 }),
      ]);
      const mine = home.myCircles.some((c) => c.id === circle.id || c.slug === circle.slug);
      return { circle, mine, posts };
    },
  });

  const joinMutation = useMutation({
    mutationFn: () =>
      data?.mine
        ? communityService.leaveCircle(data.circle.id)
        : communityService.joinCircle(data!.circle.id),
    onSuccess: () => {
      toast.success(data?.mine ? "Left the circle" : "Welcome to the circle");
      queryClient.invalidateQueries({ queryKey: ["community", "circle", slug] });
      queryClient.invalidateQueries({ queryKey: ["community", "home"] });
    },
    onError: () => toast.error("Could not update membership"),
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="h-12 animate-pulse rounded-[var(--radius-stamp)] bg-secondary/15" />
        <div className="mt-6 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[var(--radius-stamp)] border border-line bg-white" />
          ))}
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-4xl" aria-hidden>🌧️</p>
        <h1 className="mt-3 font-display text-3xl text-ink">This board is gone.</h1>
        <p className="mt-2 text-sm text-ink-faint">It may have been renamed or removed.</p>
        <Link href="/community" className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.18em] text-stamp underline underline-offset-4">
          Back to the circle
        </Link>
      </main>
    );
  }

  const { circle, mine, posts } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint hover:text-stamp"
      >
        <ArrowLeft className="h-3 w-3" />
        The circle
      </Link>

      {/* ------------------------------------------------ board header */}
      <section className="relative mt-4">
        <div className="absolute -top-2 right-6 z-10 hidden sm:block" aria-hidden>
          <Stamp text={mine ? "Member" : "Open to all"} tone={mine ? "leaf" : "ink"} />
        </div>
        <PaintedBoard
          name={circle.name}
          icon={circle.icon}
          size="lg"
          className="max-w-none w-full justify-center text-center py-3.5"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-ink-soft">
          {circle.description ?? "A board for mamas to share and support each other."}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-stamp" />
            {circle._count.members} mamas
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-stamp" />
            {circle._count.posts} posts
          </span>
        </div>
        <div className="mt-5 flex justify-center gap-3">
          {!mine && (
            <button
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending}
              className="rounded-[var(--radius-stamp)] bg-gold px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(199,125,26,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {joinMutation.isPending ? "Joining…" : "Join this board"}
            </button>
          )}
          {mine && (
            <button
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending}
              className="rounded-[var(--radius-stamp)] border border-line bg-white px-5 py-2 text-sm font-bold uppercase tracking-wide text-ink-soft transition-colors hover:bg-background-soft disabled:opacity-50"
            >
              Leave circle
            </button>
          )}
          <Link
            href={`/community/new?circle=${circle.id}`}
            className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-secondary px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-[var(--shadow-paper)] transition-all hover:-translate-y-0.5"
          >
            <PenLine className="h-4 w-4" />
            Post here
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------- posts */}
      <section className="mt-10 space-y-4" aria-label="Posts">
        {posts.length === 0 && (
          <div className="rounded-[var(--radius-stamp)] border border-dashed border-line bg-white p-10 text-center">
            <p className="text-3xl" aria-hidden>🧵</p>
            <p className="mt-2 text-sm font-semibold text-ink">Nothing on this board yet.</p>
            <p className="mt-1 text-xs text-ink-faint">Start the first thread — mamas are waiting.</p>
          </div>
        )}
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </section>
    </main>
  );
}
