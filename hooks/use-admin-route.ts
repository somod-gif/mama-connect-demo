"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useAdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.replace("/login");
      else if (user?.role !== "ADMIN") router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return { isAuthenticated, isLoading, isAdmin: user?.role === "ADMIN" };
}
