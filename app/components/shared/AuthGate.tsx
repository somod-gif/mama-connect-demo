"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAccessToken, getRefreshToken } from "@/services/api";

/**
 * Used on auth-adjacent pages (e.g. /login, /setup): visitors who already
 * hold tokens should skip the form. Goes to the ?redirect target when the
 * middleware set one, otherwise to the role-appropriate home so ADMINs are
 * never dumped on the CHEW dashboard.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    const token = getAccessToken();
    const refresh = getRefreshToken();
    if (!(token || refresh)) return;

    redirected.current = true;
    const redirectParam = searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
      router.replace(redirectParam);
      return;
    }

    let role = "";
    try {
      role = JSON.parse(atob((token || "").split(".")[1])).role || "";
    } catch {
      role = "";
    }
    router.replace(role === "ADMIN" ? "/admin" : "/dashboard");
  }, [router, searchParams]);

  return <>{children}</>;
}
