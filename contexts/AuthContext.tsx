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
  User,
  VerificationStatus,
} from "@/types/auth";
import { authService } from "@/services/auth.service";
import {
  setChewAccessToken,
  setChewRefreshToken,
  clearChewTokens,
  getChewRefreshToken,
  getChewAccessToken,
} from "@/services/api";

function parseUserFromToken(): User | null {
  const token = getChewAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub || payload.id || "",
      firstName: payload.firstName || payload.name?.split(" ")[0] || "",
      lastName: payload.lastName || payload.name?.split(" ").slice(1).join(" ") || "",
      email: payload.email || "",
      phone: payload.phone || "",
      role: payload.role || "chew",
      verificationStatus: (payload.verificationStatus as VerificationStatus) || "PENDING",
      state: payload.state,
      lga: payload.lga,
      primaryHealthcareCentre: payload.primaryHealthcareCentre,
      preferredLanguage: payload.preferredLanguage,
    };
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("mama_chew_user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mama_chew_user", JSON.stringify(user));
  } catch { }
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("mama_chew_user");
  } catch { }
}

function extractErrorMessage(error: unknown): string {
  const err = error as Record<string, unknown> | null | undefined;
  if (err?.response && typeof err.response === "object") {
    const resp = err.response as Record<string, unknown>;
    const data = resp.data as Record<string, unknown> | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;
    if (typeof resp.status === "number" && resp.status >= 500) return "Server unavailable. Please try again later.";
  }
  if (err?.code === "ECONNABORTED") return "Request timed out. Please check your connection.";
  if (!err?.response && err?.code !== "ERR_CANCELED") return "Network error. Please check your internet connection.";
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
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
      const token = getChewAccessToken();
      if (token) {
        const user = parseUserFromToken() || getStoredUser();
        if (user) {
          setStoredUser(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      const storedUser = getStoredUser();
      if (storedUser) {
        setState({ user: storedUser, isAuthenticated: true, isLoading: false });
        const storedRefreshToken = getChewRefreshToken();
        if (storedRefreshToken) {
          try {
            const response = await authService.refresh(storedRefreshToken);
            setChewAccessToken(response.accessToken);
            setChewRefreshToken(response.refreshToken);
            const freshUser = parseUserFromToken();
            if (freshUser) {
              setStoredUser(freshUser);
              setState({ user: freshUser, isAuthenticated: true, isLoading: false });
            }
          } catch { }
        }
        return;
      }

      const storedRefreshToken = getChewRefreshToken();
      if (storedRefreshToken) {
        const response = await authService.refresh(storedRefreshToken);
        setChewAccessToken(response.accessToken);
        setChewRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          setStoredUser(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      clearChewTokens();
      clearStoredUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(
    async (data: LoginRequest) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.login(data);
        setChewAccessToken(response.accessToken);
        setChewRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          user.verificationStatus = (response.user?.verificationStatus as VerificationStatus) || "PENDING";
          setStoredUser(user);
        }
        setState({
          user: user || null,
          isAuthenticated: true,
          isLoading: false,
        });

        if (user?.verificationStatus === "PENDING") {
          toast.info("Your account is pending verification");
          router.push("/pending-approval");
        } else {
          toast.success("Welcome back");
          router.push("/dashboard");
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const message = extractErrorMessage(error);
        toast.error(message);
        throw error;
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.register(data);
        setChewAccessToken(response.accessToken);
        setChewRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          user.verificationStatus = "PENDING";
          setStoredUser(user);
        }
        setState({
          user: user || null,
          isAuthenticated: true,
          isLoading: false,
        });
        router.push("/pending-approval");
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
      const storedRefreshToken = getChewRefreshToken();
      if (storedRefreshToken) {
        await authService.logout(storedRefreshToken);
      }
    } catch { }
    clearChewTokens();
    clearStoredUser();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    router.push("/chew/login");
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
      const storedRefreshToken = getChewRefreshToken();
      if (!storedRefreshToken) throw new Error("No refresh token");
      const response = await authService.refresh(storedRefreshToken);
      setChewAccessToken(response.accessToken);
      setChewRefreshToken(response.refreshToken);
      const user = parseUserFromToken();
      if (user) {
        setStoredUser(user);
        setState((prev) => ({ ...prev, user }));
      }
    } catch {
      clearChewTokens();
      clearStoredUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refresh, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
