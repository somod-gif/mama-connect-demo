"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { marketplaceService } from "@/lib/services/marketplace.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Stamp } from "@/app/components/shared/Stamp";
import { koboToNaira, formatDateTime } from "@/lib/utils/format";
import { RequireRole } from "@/app/components/shared/RequireRole";

const STAMP_FOR: Record<string, "ink" | "stamp" | "leaf"> = {
  PAID: "leaf",
  CANCELLED: "stamp",
  FAILED: "stamp",
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["market", "orders"],
    queryFn: marketplaceService.listOrders,
  });

  return (
    <RequireRole roles={["PATIENT", "CUSTOMER", "CHEW", "SUPERVISOR", "FACILITY_STAFF", "ORG_ADMIN", "ADMIN"]}>
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <PageHeader
            eyebrow="Marketplace"
            title="My orders"
            titleAccent="."
            description="Every checkout on the market, with its own paper trail."
            actions={
              <Link
                href="/market"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:underline"
              >
                Back to the market
              </Link>
            }
          />

          {isLoading || !orders ? (
            <div className="mt-10 flex items-center justify-center py-24">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
                Pulling receipts…
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-10 py-20 text-center border-2 border-dashed border-line rounded-lg">
              <ShoppingBag className="w-10 h-10 mx-auto text-ink-faint" />
              <p className="mt-3 text-sm text-ink-soft">
                No orders yet. Your first MamaConnect order will show up here.
              </p>
              <Link
                href="/market"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
              >
                Browse the market
              </Link>
            </div>
          ) : (
            <ul className="mt-10 space-y-3">
              {orders.map((order) => {
                const count = order.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <Link
                    key={order.id}
                    href={`/market/orders/${order.id}`}
                    className="group flex items-center gap-4 border-2 border-line bg-bone rounded-lg p-4 shadow-paper hover:border-ink transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 font-semibold text-ink group-hover:underline decoration-stamp decoration-2 underline-offset-2">
                        {order.items.slice(0, 2).map((i) => i.name).join(" · ")}
                        {order.items.length > 2 ? ` · +${order.items.length - 2} more` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {count} item{count === 1 ? "" : "s"} ·{" "}
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-lg text-ink">
                        {koboToNaira(order.totalKobo)}
                      </p>
                      <span className="mt-1 inline-block">
                        <Stamp
                          text={order.status}
                          tone={STAMP_FOR[order.status] ?? "ink"}
                          rotation={-1.5}
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </RequireRole>
  );
}