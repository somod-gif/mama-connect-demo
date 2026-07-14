"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getRefreshToken } from "@/lib/api";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    const token = getAccessToken();
    const refresh = getRefreshToken();
    if (token || refresh) {
      redirected.current = true;
      router.replace("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
}
