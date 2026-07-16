import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export function careStatusToRiskLevel(careStatus: string | null | undefined): RiskLevel {
  switch ((careStatus ?? "").toUpperCase()) {
    case "URGENT_REFERRAL":
    case "URGENT":
      return "HIGH";
    case "PRIORITY_ATTENTION":
    case "PRIORITY":
      return "MEDIUM";
    default:
      return "LOW";
  }
}

export function normalizeRiskFactors(rf: string[] | string | null | undefined): string[] {
  if (Array.isArray(rf)) return rf;
  if (typeof rf === "string" && rf.trim()) {
    return rf.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

