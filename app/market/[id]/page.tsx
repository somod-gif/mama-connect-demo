"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Loader2, ShieldCheck } from "lucide-react";
import { marketplaceService } from "@/lib/services/marketplace.service";
import { Stamp } from "@/app/components/shared/Stamp";
import { koboToNaira } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["market", "product", params.id],
    queryFn: () => marketplaceService.getProduct(params.id),
    enabled: Boolean(params.id),
  });

  const addMutation = useMutation({
    mutationFn: (qty: number) => marketplaceService.addToCart(params.id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market", "cart"] });
      toast.success("Added to your cart");
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not add to cart");
    },
  });

  if (isLoading || !product) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Fetching the shelf…
        </span>
      </main>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/market"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to the market
        </Link>

        <div className="mt-6 grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
            className="aspect-[4/3] border-2 border-line bg-paper-deep/50 paper-ruled rounded-lg shadow-paper overflow-hidden flex items-center justify-center"
          >
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-8xl text-ink/15">
                {product.name.slice(0, 1)}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {product.category} · {product.sku}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-ink leading-[1.05]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {product.requiresPrescription && (
                <Stamp text="Requires prescription" tone="stamp" rotation={-2} />
              )}
              {outOfStock ? (
                <Stamp text="Out of stock" tone="stamp" rotation={1} />
              ) : product.stock <= 5 ? (
                <Stamp text={`Only ${product.stock} left`} tone="ink" rotation={1.5} />
              ) : (
                <Stamp text="In stock" tone="leaf" rotation={-1} />
              )}
            </div>

            <p className="mt-6 font-display text-5xl text-ink">
              {koboToNaira(product.priceKobo)}
            </p>

            {product.description && (
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                {product.description}
              </p>
            )}

            {product.clinicalTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.clinicalTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-leaf-light text-leaf-dark font-mono text-[11px] font-medium uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="inline-flex items-center border-2 border-ink rounded-xl overflow-hidden self-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={outOfStock}
                  className="px-3.5 py-3 text-ink hover:bg-paper-deep/60 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-10 text-center font-mono text-sm font-bold text-ink">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={outOfStock || quantity >= product.stock}
                  className="px-3.5 py-3 text-ink hover:bg-paper-deep/60 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push(`/market/signup?redirect=${encodeURIComponent(`/market/${product.id}`)}`);
                    return;
                  }
                  addMutation.mutate(quantity);
                }}
                disabled={outOfStock || addMutation.isPending}
                className="inline-flex flex-1 items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60 transition-colors"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {outOfStock ? "Sold out" : "Add to cart"}
              </button>
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs text-ink-faint leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-leaf" />
              Pay by bank transfer to a Monnify account or by card — the payment
              window stays open for 24 hours, and your CHEW can handle pickup.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}