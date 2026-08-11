"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  AuthContextValue,
  AuthState,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  UserRole,
  VerificationStatus,
} from "@/types/auth";
import { authService } from "@/services/auth.service";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  syncAuthToCookie,
} from "@/services/api";
import { extractErrorMessage } from "@/lib/errors";

function parseUserFromToken(): User | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub || payload.id || "",
      firstName: payload.firstName || payload.name?.split(" ")[0] || "",
      lastName: payload.lastName || payload.name?.split(" ").slice(1).join(" ") || "",
      email: payload.email || "",
      phone: payload.phone || "",
      role: (payload.role || "CHEW") as UserRole,
      verificationStatus: (payload.verificationStatus || "PENDING") as VerificationStatus,
      state: payload.state,
      lga: payload.lga,
      preferredLanguage: payload.preferredLanguage,
    };
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("mama_user");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("mama_user", JSON.stringify(user)); } catch { }
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem("mama_user"); } catch { }
}

function userFromProfile(profile: Record<string, unknown>): User {
  const lgaObj = profile.lga && typeof profile.lga === "object"
    ? profile.lga as { id: string; name: string; state: { id: string; name: string } }
    : null;
  return {
    id: profile.id as string,
    name: profile.name as string | undefined,
    firstName: (profile.name as string)?.split(" ")[0] || (profile.firstName as string) || "",
    lastName: (profile.name as string)?.split(" ").slice(1).join(" ") || (profile.lastName as string) || "",
    email: profile.email as string,
    phone: (profile.phone as string) || "",
    role: (profile.role as UserRole) || "CHEW",
    verificationStatus: (profile.verificationStatus as VerificationStatus) || "PENDING",
    state: lgaObj?.state?.name || (typeof profile.lga === "string" ? profile.lga : undefined),
    lga: lgaObj?.name || (typeof profile.lga === "string" ? profile.lga : undefined),
    facility: (profile.facility as string) || undefined,
    organizationId: (profile.organizationId as string) || undefined,
    organizationName: (profile.organizationName as string) || undefined,
    patient: profile.patient
      ? (profile.patient as User["patient"])
      : undefined,
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const initializeAuth = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (token) {
        try {
          const profile = await authService.getMe() as unknown as Record<string, unknown>;
          const user = userFromProfile(profile);
          setStoredUser(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          const user = parseUserFromToken() || getStoredUser();
          if (user) {
            setStoredUser(user);
            setState({ user, isAuthenticated: true, isLoading: false });
            return;
          }
        }
      }

      const storedRefreshToken = getRefreshToken();
      if (storedRefreshToken) {
        try {
          const response = await authService.refresh(storedRefreshToken);
          setAccessToken(response.accessToken);
          setRefreshToken(response.refreshToken);
          syncAuthToCookie();

          try {
            const profile = await authService.getMe() as unknown as Record<string, unknown>;
            const user = userFromProfile(profile);
            setStoredUser(user);
            setState({ user, isAuthenticated: true, isLoading: false });
            return;
          } catch {
            const user = parseUserFromToken();
            if (user) {
              setStoredUser(user);
              setState({ user, isAuthenticated: true, isLoading: false });
              return;
            }
          }
        } catch {
          const storedUser = getStoredUser();
          if (storedUser) {
            setState({ user: storedUser, isAuthenticated: true, isLoading: false });
            return;
          }
        }
      }

      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      clearTokens();
      clearStoredUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeAuth();
  }, [initializeAuth]);

  // The API client fires this when a refresh attempt fails — the session is
  // genuinely dead. Route via the Next router instead of a hard reload so
  // users never see a jarring page refresh.
  useEffect(() => {
    const handleSessionExpired = () => {
      clearTokens();
      clearStoredUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        router.push("/login");
      }
    };
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [router]);

  const finalizeSession = useCallback(async (response: TokenResponse) => {
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    syncAuthToCookie();

    let user: User | null = null;
    try {
      const profile = (await authService.getMe()) as unknown as Record<string, unknown>;
      user = userFromProfile(profile);
      setStoredUser(user);
    } catch {
      // Token is valid even if the profile fetch blips — fall back to the
      // token payload so a valid login never presents as a failure.
      user = parseUserFromToken();
      if (user) setStoredUser(user);
    }

    if (!user) {
      throw new Error("Could not load your profile. Please try again.");
    }

    setState({ user, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      // Drop any stale tokens from a previous session BEFORE attempting the
      // login — otherwise a lingering refresh token could be picked up by the
      // 401-refresh interceptor and mask the real error (or fail outright).
      clearTokens();
      syncAuthToCookie();
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.login(data);
        const user = await finalizeSession(response);
        toast.success(user.role === "ADMIN" ? "Welcome, Admin" : "Welcome back");
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const message = extractErrorMessage(error);
        toast.error(message);
        throw error;
      }
    },
    [finalizeSession]
  );

  const loginWithOtp = useCallback(
    async (phone: string, code: string) => {
      clearTokens();
      syncAuthToCookie();
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.verifyOtp(phone, code);
        await finalizeSession(response);
        toast.success("Welcome, Mama");
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const message = extractErrorMessage(error);
        toast.error(message);
        throw error;
      }
    },
    [finalizeSession]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.register(data);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        syncAuthToCookie();

        sessionStorage.setItem("mama_pending_profile", JSON.stringify({
          stateId: data.stateId,
          lgaId: data.lgaId,
          primaryHealthcareCentre: data.primaryHealthcareCentre,
        }));

        const user = parseUserFromToken();
        if (user) {
          user.verificationStatus = "PENDING";
          setStoredUser(user);
          setState({ user, isAuthenticated: true, isLoading: false });
        } else {
          setState({ user: null, isAuthenticated: false, isLoading: false });
          toast.error("Registration failed: invalid response");
          return;
        }
        router.push("/dashboard");
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const message = extractErrorMessage(error);
        toast.error(message);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      const storedRefreshToken = getRefreshToken();
      if (storedRefreshToken) await authService.logout(storedRefreshToken);
    } catch { }
    clearTokens();
    clearStoredUser();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((data: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...data };
      setStoredUser(updated);
      return { ...prev, user: updated };
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      const storedRefreshToken = getRefreshToken();
      if (!storedRefreshToken) throw new Error("No refresh token");
      const response = await authService.refresh(storedRefreshToken);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      syncAuthToCookie();

      try {
        const profile = await authService.getMe() as unknown as Record<string, unknown>;
        const user = userFromProfile(profile);
        setStoredUser(user);
        setState((prev) => ({ ...prev, user }));
      } catch {
        const user = parseUserFromToken();
        if (user) {
          setStoredUser(user);
          setState((prev) => ({ ...prev, user }));
        }
      }
    } catch {
      clearTokens();
      clearStoredUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithOtp, register, logout, refresh, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
