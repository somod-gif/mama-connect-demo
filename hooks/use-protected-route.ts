"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.replace("/login");
      else if (user?.role === "ADMIN") router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return { isAuthenticated, isLoading, role: user?.role };
}
