"use client";

import { CommunityHeader } from "@/app/components/community/CommunityHeader";
import { useProtectedRoute } from "@/hooks/use-protected-route";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useProtectedRoute();
  if (isLoading || !isAuthenticated) return null;
  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader />
      {children}
    </div>
  );
}
