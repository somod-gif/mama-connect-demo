"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, HeartHandshake, ClipboardCheck } from "lucide-react";
import { communityService } from "@/lib/services/community.service";
import { Stamp } from "@/app/components/community/Stamp";

const FALLBACK_GUIDELINES: Array<{ rule: string; detail: string }> = [
  { rule: "Mama Circle is peer support, not medical care.", detail: "Always follow your CHEW, midwife or doctor." },
  { rule: "Be respectful and kind.", detail: "Every mama is doing her best." },
  { rule: "No diagnosing and no prescribing.", detail: "Never tell a mother what she 'has' or what to take." },
  { rule: "Protect privacy.", detail: "No full names, addresses, phones or clinic photos." },
  { rule: "Report dangerous content.", detail: "The report button keeps the circle safe." },
];

export default function GuidelinesPage() {
  const { data } = useQuery({
    queryKey: ["community", "home"],
    queryFn: () => communityService.getHome(),
  });

  const guidelines = data?.guidelines ?? FALLBACK_GUIDELINES;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stamp">
          Mama Circle
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">How we stay safe together</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          This is a village square, not a clinic. Read once, and keep it in mind every time you post.
        </p>
      </div>

      <section className="mt-8 rounded-[var(--radius-stamp)] border border-danger/20 bg-danger-light p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger" />
          <div>
            <p className="text-[13px] font-bold text-danger-dark">
              Emergency symptoms need professional help now
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-danger">
              Severe bleeding, seizures, severe headache, blurred vision, reduced baby movement, breathing difficulty — contact your CHEW or go to a hospital immediately. Do not wait for the board.
            </p>
          </div>
        </div>
      </section>

      <ol className="mt-8 space-y-3">
        {guidelines.map((g, i) => (
          <li
            key={i}
            className="relative rounded-[var(--radius-stamp)] border border-line bg-white p-5 shadow-[var(--shadow-paper)]"
          >
            <span className="absolute -top-2 left-4">
              <Stamp text={`No. ${String(i + 1).padStart(2, "0")}`} tone="ink" />
            </span>
            <h2 className="flex items-start gap-2.5 text-[15px] font-bold leading-snug text-ink">
              <HeartHandshake className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              {g.rule}
            </h2>
            <p className="mt-1.5 pl-6 text-[13px] leading-relaxed text-ink-soft">{g.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-stamp)] border border-stamp/30 bg-stamp-light/50 p-5">
        <ClipboardCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-stamp" />
        <p className="text-[13px] leading-relaxed text-ink">
          Every post and comment is screened by MamaBot and reviewed by human moderators. If you see something wrong, use the <strong>Report</strong> button — your circle keeps each other safe.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/community"
          className="rounded-[var(--radius-stamp)] bg-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[var(--shadow-paper)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Back to the circle
        </Link>
      </div>
    </main>
  );
}
