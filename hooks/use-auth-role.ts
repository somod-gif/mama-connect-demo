import { useAuth } from "./useAuth";

export function useAuthRole() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    user,
    role: user?.role || null,
    verificationStatus: user?.verificationStatus || null,
    isAdmin: isAuthenticated && user?.role === "ADMIN",
    isChew: isAuthenticated && user?.role === "CHEW",
    isVerified: user?.verificationStatus === "VERIFIED",
    isPending: user?.verificationStatus === "PENDING",
  };
}
