"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  PackageOpen,
} from "lucide-react";
import { marketplaceService } from "@/lib/services/marketplace.service";
import { Stamp } from "@/app/components/shared/Stamp";
import { koboToNaira, formatDateTime } from "@/lib/utils/format";
import { toast } from "sonner";
import type { Order, PaymentInstructions } from "@/lib/types/marketplace";

type Stage = "loading" | "checkout" | "payment" | "paid" | "error";

const STORAGE_KEY = (orderId: string) => `mc_instructions_${orderId}`;

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [instructions, setInstructions] = useState<PaymentInstructions | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [statusError, setStatusError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"account" | "amount" | null>(null);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      // A fresh checkout stores its payment window here; revisits reuse it
      // instead of creating a new Monnify invoice.
      let quote: PaymentInstructions | null = null;
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY(params.id));
        if (cached) quote = JSON.parse(cached) as PaymentInstructions;
      } catch {
        quote = null;
      }

      try {
        const fetched = await marketplaceService.getOrder(params.id);
        if (!active) return;
        if (fetched.status === "PAID") {
          setOrder(fetched);
          setStage("paid");
          return;
        }
        if (fetched.status === "CANCELLED" || fetched.status === "FAILED") {
          setOrder(fetched);
          setStage("error");
          return;
        }
        setOrder(fetched);
        if (quote) {
          setInstructions(quote);
          setStage("payment");
        } else {
          // Pending order, no instructions on hand → let the user open a
          // payment window instead of firing an invoice on every visit.
          setStage("checkout");
        }
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (!active) return;
        setStatusError(
          err.response?.data?.message ??
            "This order isn’t yours, or was removed."
        );
        setStage("error");
      }
    };
    boot();
    return () => {
      active = false;
    };
  }, [params.id]);

  const copy = async (text: string, key: "account" | "amount") => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const payMutation = useMutation({
    mutationFn: () => marketplaceService.payOrder(params.id),
    onSuccess: (res) => {
      setOrder(res.order);
      setInstructions(res.paymentInstructions);
      setStage("payment");
      sessionStorage.setItem(STORAGE_KEY(params.id), JSON.stringify(res.paymentInstructions));
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not open a payment window");
    },
  });

  const statusMutation = useMutation({
    mutationFn: () => marketplaceService.paymentStatus(params.id),
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ["market", "orders"] });
      if (status.status === "PAID") {
        setStage("paid");
        toast.success("Payment confirmed — thank you mama!");
      } else {
        toast.info(
          status.message ??
            "Still pending. Transfer the amount above, then check again."
        );
      }
    },
    onError: () => toast.error("Could not check the payment right now."),
  });

  if (stage === "loading" || !order) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Preparing the receipt…
        </span>
      </main>
    );
  }

  if (stage === "error") {
    return (
      <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center border-2 border-dashed border-line rounded-lg p-10">
          <ShieldCheck className="w-10 h-10 mx-auto text-stamp" />
          <h1 className="mt-4 font-display text-2xl text-ink">Order not available</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {statusError ?? "This order can’t be opened for payment right now."}
          </p>
          <Link
            href="/market/orders"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my orders
          </Link>
        </div>
      </main>
    );
  }

  if (stage === "paid") {
    return (
      <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <Stamp
            text="Paid in full"
            tone="leaf"
            animate
            rotation={-2}
            className="text-sm px-3 py-1"
          />
          <h1 className="mt-6 font-display text-4xl md:text-5xl text-ink">
            The card is <em className="italic text-stamp">stamped</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Payment for <strong className="text-ink">{order.orderNumber}</strong>{" "}
            ({koboToNaira(order.totalKobo)}) went through. Your CHEW will be in
            touch about pickup.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/market"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
            >
              Back to the market
            </Link>
            <Link
              href="/market/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold border-2 border-ink rounded-xl hover:bg-paper-deep/40 transition-colors text-ink"
            >
              <PackageOpen className="w-4 h-4" />
              My orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/market/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          My orders
        </Link>

        <div className="mt-6 text-center">
          <Stamp
            text={order.status}
            tone={stage === "payment" ? "stamp" : "ink"}
            animate
            rotation={-2}
            className="text-sm px-3 py-1"
          />
          <h1 className="mt-6 font-display text-4xl md:text-5xl text-ink leading-tight">
            {stage === "payment" ? "Here’s how to pay" : "Your order is in"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {order.orderNumber} · {koboToNaira(order.totalKobo)} · {itemCount}{" "}
            item{itemCount === 1 ? "" : "s"}
          </p>
        </div>

        {stage === "checkout" && (
          <div className="mt-8 text-center">
            <div className="border-2 border-line bg-bone rounded-lg p-8 max-w-md mx-auto shadow-paper">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                Payment window
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                Open a payment window to get the transfer account and card link
                for this order.
              </p>
              <button
                onClick={() => payMutation.mutate()}
                disabled={payMutation.isPending}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60 transition-colors"
              >
                {payMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Banknote className="w-4 h-4" />
                )}
                Open payment window
              </button>
            </div>
          </div>
        )}

        {stage === "payment" && instructions && (
          <div className="mt-8 border-2 border-ink bg-bone rounded-lg overflow-hidden shadow-paper">
            <div className="border-b-2 border-dashed border-line px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Transfer to
                </p>
                <p className="text-lg font-bold text-ink truncate">
                  {instructions.accountName}
                </p>
                <p className="text-xs text-ink-soft">{instructions.bankName}</p>
              </div>
              <Banknote className="w-8 h-8 shrink-0 text-ink-faint" />
            </div>

            <div className="px-6 py-6 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <dt className="text-sm text-ink-soft">Account number</dt>
                <dd className="flex items-center gap-2 font-mono text-base font-bold text-ink">
                  {instructions.accountNumber}
                  <button
                    onClick={() => copy(instructions.accountNumber, "account")}
                    className="p-1.5 rounded-md hover:bg-paper-deep/60 transition-colors"
                    aria-label="Copy account number"
                  >
                    {copied === "account" ? (
                      <Check className="w-4 h-4 text-leaf" />
                    ) : (
                      <Copy className="w-4 h-4 text-ink-faint" />
                    )}
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <dt className="text-sm text-ink-soft">Amount</dt>
                <dd className="flex items-center gap-2 font-display text-xl text-ink">
                  {koboToNaira(order.totalKobo)}
                  <button
                    onClick={() => copy(koboToNaira(order.totalKobo), "amount")}
                    className="p-1.5 rounded-md hover:bg-paper-deep/60 transition-colors"
                    aria-label="Copy amount"
                  >
                    {copied === "amount" ? (
                      <Check className="w-4 h-4 text-leaf" />
                    ) : (
                      <Copy className="w-4 h-4 text-ink-faint" />
                    )}
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-ink-soft">Window closes</dt>
                <dd className="font-mono text-xs text-ink">
                  {formatDateTime(instructions.expiresAt)}
                </dd>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <a
                href={instructions.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Pay by card instead
              </a>

              <button
                onClick={() => statusMutation.mutate()}
                disabled={statusMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-ink rounded-xl hover:bg-ink hover:text-bone transition-colors"
              >
                {statusMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                I’ve paid — check payment
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-center text-ink-faint">
          Paid by transfer to the account above, or with your card via the
          link. The receipt stamps automatically.
        </p>
      </div>
    </main>
  );
}