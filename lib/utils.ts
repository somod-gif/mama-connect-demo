import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/2348169725007?text=${encodeURIComponent(message)}`;
}