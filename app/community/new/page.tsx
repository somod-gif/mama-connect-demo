"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PenLine, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { communityService } from "@/lib/services/community.service";
import type { PostType } from "@/lib/types/community";
import { POST_TYPE_LABELS } from "@/lib/types/community";
import { Stamp } from "@/app/components/community/Stamp";

const MY_POSTS_KEY = "mama_my_posts";

const postTypes: PostType[] = ["ASK", "SHARE", "SUPPORT", "CELEBRATE", "POLL", "RECOMMENDATION"];

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCircle = searchParams.get("circle");

  const [circleId, setCircleId] = useState(presetCircle ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postType, setPostType] = useState<PostType>("ASK");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [pollInput, setPollInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stamped, setStamped] = useState(false);

  const { data: home } = useQuery({
    queryKey: ["community", "home"],
    queryFn: () => communityService.getHome(),
  });

  const circles = home?.myCircles ?? [];

  const addPollOption = () => {
    const opt = pollInput.trim();
    if (!opt) return;
    if (pollOptions.length >= 12) return;
    setPollOptions((prev) => [...prev, opt.slice(0, 80)]);
    setPollInput("");
  };

  const submit = async () => {
    if (!circleId) return toast.error("Pick a board to post on");
    if (title.trim().length < 3) return toast.error("Give your post a title (3+ characters)");
    if (body.trim().length < 2) return toast.error("Write a little more");
    if (postType === "POLL" && pollOptions.length < 2)
      return toast.error("A poll needs at least 2 options");

    setSubmitting(true);
    try {
      const res = await communityService.createPost({
        circleId,
        title,
        body,
        postType,
        isAnonymous,
        poll: postType === "POLL" ? { options: pollOptions } : undefined,
      });
      setStamped(true);
      try {
        const list = JSON.parse(localStorage.getItem(MY_POSTS_KEY) ?? "[]");
        const postId = "id" in res.post ? res.post.id : null;
        if (postId && !list.includes(postId)) list.push(postId);
        localStorage.setItem(MY_POSTS_KEY, JSON.stringify(list));
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 1400));
      if ("id" in res.post && res.post.status !== "HIDDEN") {
        router.push(`/community/post/${res.post.id}`);
      } else {
        router.push("/community");
      }
    } catch {
      toast.error("Could not post — try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (stamped) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Stamp text={postType === "POLL" ? "Poll posted" : "Posted to the board"} tone="leaf" />
        <h1 className="mt-5 font-display text-3xl text-ink">On the board.</h1>
        <p className="mt-2 text-sm text-ink-faint">
          The circle can see your post. Our moderators review everything.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint hover:text-stamp"
      >
        <ArrowLeft className="h-3 w-3" />
        The circle
      </Link>

      <div className="relative mt-4 rounded-[var(--radius-stamp)] border border-line bg-white shadow-[var(--shadow-paper)]">
        <div className="paper-ruled rounded-[var(--radius-stamp)] p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stamp">
            New thread
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">Post to the board</h1>

          {/* circle */}
          <label className="mt-6 block text-[11px] font-bold uppercase tracking-wide text-ink-soft" htmlFor="circle">
            Which board?
          </label>
          <select
            id="circle"
            value={circleId}
            onChange={(e) => setCircleId(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-stamp focus:outline-none"
          >
            <option value="">Pick a board…</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon ? `${c.icon} ` : ""}{c.name}
              </option>
            ))}
          </select>

          {/* type */}
          <label className="mt-5 block text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            What is it?
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {postTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPostType(t)}
                aria-pressed={postType === t}
                className={
                  postType === t
                    ? "rounded-[var(--radius-stamp)] bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                    : "rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint hover:text-ink"
                }
              >
                {POST_TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* title */}
          <label className="mt-5 block text-[11px] font-bold uppercase tracking-wide text-ink-soft" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={160}
            placeholder="A short, clear question or share"
            className="mt-1.5 w-full rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-stamp focus:outline-none"
          />

          {/* body */}
          <label className="mt-5 block text-[11px] font-bold uppercase tracking-wide text-ink-soft" htmlFor="body">
            Details
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="Share your experience or ask your question — kindly. No diagnosing, no naming medicines."
            className="mt-1.5 w-full resize-none rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-stamp focus:outline-none"
          />

          {/* poll */}
          {postType === "POLL" && (
            <div className="mt-5 rounded-[var(--radius-stamp)] border border-gold/30 bg-gold-light/60 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold-dark">
                Poll options ({pollOptions.length}/12)
              </p>
              <div className="mt-2 space-y-1.5">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-faint">{i + 1}.</span>
                    <span className="flex-1 rounded-[var(--radius-stamp)] border border-line bg-white px-2.5 py-1.5 text-[13px] text-ink">
                      {opt}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPollOptions((prev) => prev.filter((_, j) => j !== i))}
                      aria-label={`Remove option ${opt}`}
                      className="text-ink-faint hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex gap-2">
                <input
                  value={pollInput}
                  onChange={(e) => setPollInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPollOption();
                    }
                  }}
                  placeholder="Add an option"
                  className="flex-1 rounded-[var(--radius-stamp)] border border-line bg-white px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-stamp focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addPollOption}
                  className="flex items-center gap-1 rounded-[var(--radius-stamp)] border border-gold/40 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gold-dark hover:bg-gold-light"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>
          )}

          {/* anonymous */}
          <label className="mt-5 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 accent-[#351951]"
            />
            <span className="text-[13px] font-semibold text-ink-soft">
              Post as <span className="font-mono text-[11px] uppercase">Anonymous Mama</span>
            </span>
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/70 pt-5">
            <button
              onClick={submit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-[var(--radius-stamp)] bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(199,125,26,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-dark disabled:opacity-50"
            >
              <PenLine className="h-4 w-4" />
              {submitting ? "Posting…" : "Post it"}
            </button>
            <p className="text-[11px] leading-snug text-ink-faint">
              Every post is reviewed by MamaBot and our human moderators.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function NewPostPage() {
  return (
    <Suspense>
      <NewPostForm />
    </Suspense>
  );
}
