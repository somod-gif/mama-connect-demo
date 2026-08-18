"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { marketplaceService } from "@/lib/services/marketplace.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Stamp } from "@/app/components/shared/Stamp";
import { koboToNaira } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types/marketplace";

const categories: Array<{ value: ProductCategory | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "NUTRITION", label: "Nutrition" },
  { value: "MATERNITY", label: "Maternity" },
  { value: "BABY_CARE", label: "Baby care" },
  { value: "WELLNESS", label: "Wellness" },
  { value: "TESTS", label: "Tests" },
  { value: "SUPPORT", label: "Support" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function MarketPage() {
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["market", "products", { category, tag, q: debouncedSearch, page }],
    queryFn: () =>
      marketplaceService.getProducts({
        category: category || undefined,
        tag: tag || undefined,
        search: debouncedSearch || undefined,
        page,
        limit: 12,
      }),
    placeholderData: (previous) => previous,
  });

  const totalPages = data?.pages ?? 1;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="The MamaConnect store"
          title="The market"
          titleAccent="."
          description="Iron, kits, tests and support for the full pregnancy year — pay on transfer, pay by card, or pick up from your CHEW."
          actions={
            <Link
              href="/market/cart"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
            >
              <Package className="w-4 h-4" />
              Open cart
            </Link>
          }
        />

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((option) => (
              <button
                key={option.value || "all"}
                onClick={() => {
                  setCategory(option.value);
                  setPage(1);
                }}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold uppercase tracking-wider font-mono transition-colors",
                  category === option.value
                    ? "border-ink bg-ink text-bone"
                    : "border-line text-ink-soft hover:border-ink/40 hover:text-ink"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search the market…"
              aria-label="Search products"
              className="w-full rounded-xl border-2 border-line bg-bone pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mr-1">
            Trimester
          </span>
          {[
            { value: "", label: "All stages" },
            { value: "trim1", label: "1st (0–13w)" },
            { value: "trim2", label: "2nd (14–27w)" },
            { value: "trim3", label: "3rd (28w+)" },
            { value: "wk34+", label: "34 weeks +" },
          ].map((option) => (
            <button
              key={option.value || "stage-all"}
              onClick={() => {
                setTag(option.value);
                setPage(1);
              }}
              className={cn(
                "shrink-0 px-3 py-1 rounded-full border text-[11px] font-semibold transition-colors",
                tag === option.value
                  ? "border-stamp bg-stamp text-bone"
                  : "border-line text-ink-soft hover:border-stamp/50 hover:text-ink"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isLoading && !data ? (
          <div className="mt-12 py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
              Opening the market…
            </span>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="mt-12 py-20 text-center border-2 border-dashed border-line rounded-lg">
            <Package className="w-10 h-10 mx-auto text-ink-faint" />
            <p className="mt-3 text-sm text-ink-soft">
              Nothing on this shelf yet. Try a different search or category.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {data.total} item{data.total === 1 ? "" : "s"} on the shelf
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.items.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/market/${product.id}`}
                    className="group block h-full border-2 border-line bg-bone rounded-lg shadow-paper overflow-hidden transition-all hover:-translate-y-0.5 hover:border-ink/50"
                  >
                    <div className="relative aspect-[4/3] bg-paper-deep/50 paper-ruled flex items-center justify-center overflow-hidden">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-display text-5xl text-ink/20">
                          {product.name.slice(0, 1)}
                        </span>
                      )}
                      {product.requiresPrescription && (
                        <span className="absolute left-2.5 top-2.5">
                          <Stamp text="Rx needed" tone="stamp" />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                        {product.category}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-ink group-hover:underline decoration-stamp decoration-2 underline-offset-4">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display text-xl text-ink">
                          {koboToNaira(product.priceKobo)}
                        </span>
                        {product.stock > 0 ? (
                          <Stamp text="In stock" tone="leaf" rotation={1.5} />
                        ) : (
                          <Stamp text="Out" tone="stamp" rotation={2} />
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-3"
                aria-label="Product pages"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-line rounded-xl disabled:opacity-40 hover:border-ink/40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-line rounded-xl disabled:opacity-40 hover:border-ink/40"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}