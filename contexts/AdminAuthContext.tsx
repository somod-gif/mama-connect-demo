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
import { adminService } from "@/services/admin.service";
import {
  setAdminAccessToken,
  setAdminRefreshToken,
  clearAdminTokens,
  getAdminRefreshToken,
  getAdminAccessToken,
} from "@/services/api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AdminAuthContextValue extends AdminAuthState {
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function parseAdminFromToken(): AdminUser | null {
  const token = getAdminAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub || payload.id || "",
      email: payload.email || "",
      name: payload.name || "Admin",
    };
  } catch {
    return null;
  }
}

function getStoredAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("mama_admin_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredAdmin(user: AdminUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mama_admin_user", JSON.stringify(user));
  } catch { }
}

function clearStoredAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("mama_admin_user");
  } catch { }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const initialize = useCallback(async () => {
    try {
      const token = getAdminAccessToken();
      if (token) {
        const user = parseAdminFromToken() || getStoredAdmin();
        if (user) {
          setStoredAdmin(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      const stored = getStoredAdmin();
      if (stored) {
        setState({ user: stored, isAuthenticated: true, isLoading: false });
        const refreshToken = getAdminRefreshToken();
        if (refreshToken) {
          try {
            const res = await adminService.refresh(refreshToken);
            setAdminAccessToken(res.accessToken);
            setAdminRefreshToken(res.refreshToken);
          } catch { }
        }
        return;
      }

      const refreshToken = getAdminRefreshToken();
      if (refreshToken) {
        const res = await adminService.refresh(refreshToken);
        setAdminAccessToken(res.accessToken);
        setAdminRefreshToken(res.refreshToken);
        const user = parseAdminFromToken();
        if (user) {
          setStoredAdmin(user);
          setState({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      clearAdminTokens();
      clearStoredAdmin();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initialize();
  }, [initialize]);

  const login = useCallback(async (data: { email: string; password: string }) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await adminService.login(data);
      setAdminAccessToken(response.accessToken);
      setAdminRefreshToken(response.refreshToken);
      const user = parseAdminFromToken();
      if (user) setStoredAdmin(user);
      setState({ user: user || null, isAuthenticated: true, isLoading: false });
      toast.success("Welcome, Admin");
      router.push("/admin");
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const err = error as Record<string, unknown>;
      const respData = err?.response ? (err.response as Record<string, unknown>).data as Record<string, unknown> : undefined;
      const message = (respData?.message as string) || "Invalid credentials";
      toast.error(message);
      throw error;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getAdminRefreshToken();
      if (refreshToken) await adminService.logout(refreshToken);
    } catch { }
    clearAdminTokens();
    clearStoredAdmin();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}
