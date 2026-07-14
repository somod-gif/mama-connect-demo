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
} from "@/lib/types/auth";
import { authService } from "@/lib/services/auth.service";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getRefreshToken,
  getAccessToken,
} from "@/lib/api";

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function parseUserFromToken(): User | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const name = payload.name || "";
    const { firstName, lastName } = splitName(name);
    return {
      id: payload.sub || payload.id || "",
      name,
      firstName,
      lastName,
      email: payload.email || "",
      phone: payload.phone || "",
      role: payload.role || "chew",
      onboardingCompleted: payload.onboardingCompleted ?? false,
    };
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("mama_user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mama_user", JSON.stringify(user));
  } catch {
    // Storage unavailable
  }
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("mama_user");
  } catch {
    // Storage unavailable
  }
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
      const existingToken = getAccessToken();
      if (existingToken) {
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

        const storedRefreshToken = getRefreshToken();
        if (storedRefreshToken) {
          try {
            const response = await authService.refresh(storedRefreshToken);
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            const freshUser = parseUserFromToken();
            if (freshUser) {
              setStoredUser(freshUser);
              setState({ user: freshUser, isAuthenticated: true, isLoading: false });
            }
          } catch {
            // Background refresh failed; stored user remains valid for this session
          }
        }
        return;
      }

      const storedRefreshToken = getRefreshToken();
      if (storedRefreshToken) {
        const response = await authService.refresh(storedRefreshToken);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          setStoredUser(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
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

  const login = useCallback(
    async (data: LoginRequest) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.login(data);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          setStoredUser(user);
        }
        setState({
          user: user || null,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success("Welcome back");
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

  const register = useCallback(
    async (data: RegisterRequest) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await authService.register(data);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        const user = parseUserFromToken();
        if (user) {
          setStoredUser(user);
        }
        setState({
          user: user || null,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success("Registration successful. Redirecting...");
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
      if (storedRefreshToken) {
        await authService.logout(storedRefreshToken);
      }
    } catch {
      // Proceed with local logout even if API call fails
    }
    clearTokens();
    clearStoredUser();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
      const storedRefreshToken = getRefreshToken();
      if (!storedRefreshToken) throw new Error("No refresh token");
      const response = await authService.refresh(storedRefreshToken);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      const user = parseUserFromToken();
      if (user) {
        setStoredUser(user);
        setState((prev) => ({ ...prev, user }));
      }
    } catch {
      clearTokens();
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
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

function extractErrorMessage(error: unknown): string {
  const err = error as Record<string, unknown> | null | undefined;
  if (err?.response && typeof err.response === "object") {
    const resp = err.response as Record<string, unknown>;
    const data = resp.data as Record<string, unknown> | undefined;
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    if (data?.error && typeof data.error === "string") {
      return data.error;
    }
    if (typeof resp.status === "number" && resp.status >= 500) {
      return "Server unavailable. Please try again later.";
    }
  }
  if (err?.code === "ECONNABORTED") {
    return "Request timed out. Please check your connection.";
  }
  if (!err?.response && err?.code !== "ERR_CANCELED") {
    return "Network error. Please check your internet connection.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}
