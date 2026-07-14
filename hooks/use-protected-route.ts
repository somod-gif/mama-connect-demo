"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/chew/login");
      } else if (user?.verificationStatus === "PENDING") {
        router.replace("/pending-approval");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return { isAuthenticated, isLoading, isVerified: user?.verificationStatus === "VERIFIED" };
}
