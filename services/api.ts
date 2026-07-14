import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mamaconnect.onrender.com/v1";

let chewAccessToken: string | null = null;
let adminAccessToken: string | null = null;

function getToken(prefix: "chew" | "admin"): string | null {
  if (prefix === "admin") return adminAccessToken;
  return chewAccessToken;
}

function setToken(prefix: "chew" | "admin", token: string | null): void {
  if (prefix === "admin") {
    adminAccessToken = token;
  } else {
    chewAccessToken = token;
  }
}

function getStorageKey(prefix: "chew" | "admin", key: string): string {
  return `mama_${prefix}_${key}`;
}

function getFromStorage(prefix: "chew" | "admin", key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(getStorageKey(prefix, key));
  } catch {
    return null;
  }
}

function setInStorage(prefix: "chew" | "admin", key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(prefix, key), value);
  } catch { }
}

function removeFromStorage(prefix: "chew" | "admin", key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getStorageKey(prefix, key));
  } catch { }
}

export function setChewAccessToken(token: string | null): void {
  setToken("chew", token);
}

export function getChewAccessToken(): string | null {
  return getToken("chew");
}

export function setAdminAccessToken(token: string | null): void {
  setToken("admin", token);
}

export function getAdminAccessToken(): string | null {
  return getToken("admin");
}

export function setChewRefreshToken(token: string | null): void {
  if (token) {
    setInStorage("chew", "refresh_token", token);
  } else {
    removeFromStorage("chew", "refresh_token");
  }
}

export function getChewRefreshToken(): string | null {
  return getFromStorage("chew", "refresh_token");
}

export function setAdminRefreshToken(token: string | null): void {
  if (token) {
    setInStorage("admin", "refresh_token", token);
  } else {
    removeFromStorage("admin", "refresh_token");
  }
}

export function getAdminRefreshToken(): string | null {
  return getFromStorage("admin", "refresh_token");
}

export function clearChewTokens(): void {
  chewAccessToken = null;
  removeFromStorage("chew", "refresh_token");
  removeFromStorage("chew", "user");
}

export function clearAdminTokens(): void {
  adminAccessToken = null;
  removeFromStorage("admin", "refresh_token");
  removeFromStorage("admin", "user");
}

function createApiInstance(prefix: "chew" | "admin"): AxiosInstance {
  const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken(prefix);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = prefix === "admin" ? getAdminRefreshToken() : getChewRefreshToken();
          if (!refreshToken) throw new Error("No refresh token");

          const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          if (prefix === "admin") {
            setAdminAccessToken(newAccessToken);
            setAdminRefreshToken(newRefreshToken);
          } else {
            setChewAccessToken(newAccessToken);
            setChewRefreshToken(newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch {
          if (prefix === "admin") {
            clearAdminTokens();
          } else {
            clearChewTokens();
          }
          if (typeof window !== "undefined") {
            window.location.href = prefix === "admin" ? "/admin/login" : "/chew/login";
          }
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const chewApi = createApiInstance("chew");
export const adminApi = createApiInstance("admin");
