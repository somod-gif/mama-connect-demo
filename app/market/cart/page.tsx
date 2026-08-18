"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2, Loader2, PackageOpen } from "lucide-react";
import { marketplaceService } from "@/lib/services/marketplace.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { koboToNaira } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { RequireRole } from "@/app/components/shared/RequireRole";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [checkingOut, setCheckingOut] = useState(false);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["market", "cart"],
    queryFn: marketplaceService.getCart,
    enabled: Boolean(user),
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      marketplaceService.updateCartItem(productId, quantity),
    onSuccess: (summary) => {
      queryClient.setQueryData(["market", "cart"], summary);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not update the item");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => marketplaceService.removeCartItem(productId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["market", "cart"] });
      toast.success("Removed from cart");
    },
    onError: () => toast.error("Could not remove the item"),
  });

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const result = await marketplaceService.checkout();
      sessionStorage.setItem(
        `mc_instructions_${result.order.id}`,
        JSON.stringify(result.paymentInstructions)
      );
      queryClient.setQueryData(["market", "cart"], { items: [], itemCount: 0, subtotalKobo: 0 });
      queryClient.invalidateQueries({ queryKey: ["market", "orders"] });
      router.push(`/market/orders/${result.order.id}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Checkout failed. Try again.");
      setCheckingOut(false);
    }
  };

  const itemCount = useMemo(() => cart?.itemCount ?? 0, [cart]);

  if (isLoading || !cart) {
    return (
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Weighing the basket…
        </span>
      </main>
    );
  }

  return (
    <RequireRole roles={["PATIENT", "CUSTOMER", "CHEW", "SUPERVISOR", "FACILITY_STAFF", "ORG_ADMIN", "ADMIN"]}>
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <PageHeader
            eyebrow="Your basket"
            title="The cart"
            titleAccent="."
            description={itemCount > 0 ? `${itemCount} item${itemCount === 1 ? "" : "s"} waiting to be checked out.` : "Nothing in here yet."}
            actions={
              <Link
                href="/market"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Keep shopping
              </Link>
            }
          />

          {cart.items.length === 0 ? (
            <div className="mt-10 py-20 text-center border-2 border-dashed border-line rounded-lg">
              <PackageOpen className="w-10 h-10 mx-auto text-ink-faint" />
              <p className="mt-3 text-sm text-ink-soft">The basket is empty.</p>
              <Link
                href="/market"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
              >
                Browse the market
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <ul className="space-y-3">
                {cart.items.map((item, index) => (
                  <motion.li
                    key={item.productId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 border-2 border-line bg-bone rounded-lg p-4 shadow-paper"
                  >
                    <div className="h-16 w-16 shrink-0 rounded-md bg-paper-deep/50 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-display text-2xl text-ink/20">
                          {item.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/market/${item.productId}`}
                        className="line-clamp-1 font-semibold text-ink hover:underline decoration-stamp decoration-2 underline-offset-2"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {koboToNaira(item.unitPriceKobo)} each
                      </p>
                    </div>
                    <div className="inline-flex items-center border-2 border-line rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="px-2.5 py-2 text-ink hover:bg-paper-deep/60"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="min-w-8 text-center font-mono text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="px-2.5 py-2 text-ink hover:bg-paper-deep/60"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="hidden sm:block font-display text-lg text-ink w-20 text-right">
                      {koboToNaira(item.lineTotalKobo)}
                    </span>
                    <button
                      onClick={() => removeMutation.mutate(item.productId)}
                      className="p-2 text-ink-faint hover:text-stamp transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.li>
                ))}
              </ul>

              <aside className="border-2 border-ink bg-bone rounded-lg p-6 shadow-paper sticky top-24">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Basket total
                </p>
                <p className="mt-2 font-display text-4xl text-ink">
                  {koboToNaira(cart.subtotalKobo)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Delivery is free to your CHEW’s pickup point.
                </p>
                <button
                  onClick={checkout}
                  disabled={checkingOut || cart.items.length === 0}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60 transition-colors"
                >
                  {checkingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PackageOpen className="w-4 h-4" />
                  )}
                  Check out
                </button>
                <p className="mt-3 text-center text-[11px] text-ink-faint">
                  You’ll get the transfer account number and card link next.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
    </RequireRole>
  );
}