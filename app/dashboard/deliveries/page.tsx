"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Package, ChevronLeft, CheckCircle2 } from "lucide-react";
import { chewService } from "@/lib/services/chew.service";
import type { DeliveryOrder } from "@/types/dashboard";

const statusClass: Record<string, string> = {
  PAID: "bg-leaf-light text-leaf",
  DELIVERED: "bg-primary-light text-primary",
  CANCELLED: "bg-background-soft text-muted-foreground",
  FAILED: "bg-danger-light text-danger",
};

function naira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  })}`;
}

export default function DeliveriesPage() {
  const queryClient = useQueryClient();
  const [history, setHistory] = useState(false);

  const { data: orders = [], isLoading } = useQuery<DeliveryOrder[]>({
    queryKey: ["chew", "deliveries", history],
    queryFn: () => chewService.getDeliveries(history),
  });

  const markDelivered = useMutation({
    mutationFn: (id: string) => chewService.markDelivered(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chew", "deliveries"] }),
  });

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Deliveries</h1>
          {orders.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">
              {orders.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-background-soft rounded-lg p-1">
          <button
            onClick={() => setHistory(false)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              !history
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground"
            }`}
          >
            Queued
          </button>
          <button
            onClick={() => setHistory(true)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              history
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading deliveries…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {history
              ? "No past deliveries yet."
              : "No orders waiting for delivery right now."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
            >
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  statusClass[order.status] ?? statusClass.PAID
                }`}
              >
                {order.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {order.orderNumber}
                  {order.patient?.name ? ` · ${order.patient.name}` : ""}
                </p>
                {order.patient?.phone && (
                  <p className="text-xs text-muted-foreground">
                    {order.patient.phone}
                    {order.patient.lga ? ` · ${order.patient.lga}` : ""}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {order.items
                    .map((i) => `${i.quantity}× ${i.name}`)
                    .join(", ")}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  {order.deliveryAddress
                    ? `Deliver to: ${order.deliveryAddress}`
                    : "Deliver to patient"}
                  {" · "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm font-bold text-foreground mt-1">
                  {naira(order.totalKobo)}
                  {order.chewCommissionKobo
                    ? ` · Commission ${naira(order.chewCommissionKobo)}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                {order.status === "PAID" && (
                  <button
                    onClick={() => markDelivered.mutate(order.id)}
                    disabled={markDelivered.isPending}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark delivered
                  </button>
                )}
                {order.patientId && (
                  <Link
                    href={`/dashboard/mothers/${order.patientId}`}
                    className="text-[11px] font-semibold px-2 py-1 rounded-lg text-primary text-center hover:underline"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}