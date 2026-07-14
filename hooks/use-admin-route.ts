"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function useAdminRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
