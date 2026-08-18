"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { authService } from "@/services/auth.service";
import { setAccessToken, setRefreshToken, syncAuthToCookie } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Stamp } from "@/app/components/shared/Stamp";

export default function MarketSignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const redirect = searchParams.get("redirect") || "/market";
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 7 &&
    form.password.length >= 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const tokens = await authService.registerCustomer({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
      });
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      syncAuthToCookie();
      await refresh();
      toast.success("Welcome to the market, mama!");
      router.push(redirect);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ??
          "Could not create your account. Check the details and try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/market"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to the market
        </Link>

        <div className="mt-6">
          <Stamp text="Customer check-in" tone="leaf" animate rotation={-2} />
          <h1 className="mt-5 font-display text-4xl md:text-5xl text-ink leading-tight">
            Open your <em className="italic text-stamp">market card</em>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Sign up once to shop the market — carts, orders and receipts all
            live under this card. Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-leaf hover:underline"
            >
              Log in instead
            </Link>
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 border-2 border-ink bg-bone rounded-lg p-6 sm:p-8 shadow-paper space-y-5"
        >
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Full name
            </span>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              required
              placeholder="e.g. Adaeze Nwosu"
              className="mt-1.5 w-full px-4 py-3 rounded-lg border-2 border-line bg-paper focus:border-ink focus:outline-none text-ink placeholder:text-ink-faint/60"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Phone number
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              required
              placeholder="e.g. 0803 123 4567"
              className="mt-1.5 w-full px-4 py-3 rounded-lg border-2 border-line bg-paper focus:border-ink focus:outline-none text-ink placeholder:text-ink-faint/60"
            />
            <span className="mt-1 block text-[11px] text-ink-faint">
              Used to reach you about pickup. Format: 0803… or +234…
            </span>
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Email <span className="normal-case tracking-normal text-ink/70">(optional)</span>
            </span>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className="mt-1.5 w-full px-4 py-3 rounded-lg border-2 border-line bg-paper focus:border-ink focus:outline-none text-ink placeholder:text-ink-faint/60"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="mt-1.5 w-full px-4 py-3 rounded-lg border-2 border-line bg-paper focus:border-ink focus:outline-none text-ink placeholder:text-ink-faint/60"
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
            Create account & shop
          </button>
        </form>
      </div>
    </main>
  );
}