import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let refreshTokenValue: string | null = null;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Endpoints where a 401 is a *request* failure (bad credentials, expired
 * refresh token), not a sign the access token expired. Retrying them through
 * the refresh flow masks the real error (e.g. login with a wrong password
 * would surface "No refresh token available" instead of "Invalid
 * credentials") and could loop/hard-redirect the user.
 */
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/set-password",
  "/auth/register-customer",
  "/auth/change-password",
  "/auth/request-otp",
  "/auth/verify-otp",
];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

/** Fired when a refresh attempt fails and the session is genuinely dead. */
export function dispatchSessionExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
}

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

function getRefreshTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("mama_refresh_token");
  } catch {
    return null;
  }
}

function setRefreshTokenInStorage(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mama_refresh_token", token);
  } catch {
    // Storage unavailable
  }
}

function clearRefreshTokenFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("mama_refresh_token");
  } catch {
    // Storage unavailable
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null): void {
  refreshTokenValue = token;
  if (token) {
    setRefreshTokenInStorage(token);
  } else {
    clearRefreshTokenFromStorage();
  }
}

export function getRefreshToken(): string | null {
  if (refreshTokenValue) return refreshTokenValue;
  refreshTokenValue = getRefreshTokenFromStorage();
  return refreshTokenValue;
}

export function clearTokens(): void {
  accessToken = null;
  refreshTokenValue = null;
  clearRefreshTokenFromStorage();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("mama_access_token");
      localStorage.removeItem("mama_user");
    } catch {}
  }
}

function setCookie(name: string, value: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=86400; SameSite=Lax`;
}

function removeCookie(name: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function syncAuthToCookie(): void {
  const token = getAccessToken();
  if (token) setCookie("mama_auth_token", token);
  else removeCookie("mama_auth_token");
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken() || (typeof window !== "undefined" ? localStorage.getItem("mama_access_token") : null);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthFailure = isAuthEndpoint(originalRequest?.url);

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthFailure) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = getRefreshToken() || (typeof window !== "undefined" ? localStorage.getItem("mama_refresh_token") : null);
        if (!storedRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        syncAuthToCookie();
        dispatchSessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
