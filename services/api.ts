import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else if (token) promise.resolve(token);
  });
  failedQueue = [];
}

function getFromStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`mama_${key}`);
  } catch { return null; }
}

function setInStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(`mama_${key}`, value); } catch { }
}

function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(`mama_${key}`); } catch { }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) setInStorage("access_token", token);
  else removeFromStorage("access_token");
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  accessToken = getFromStorage("access_token");
  return accessToken;
}

export function setRefreshToken(token: string | null): void {
  if (token) setInStorage("refresh_token", token);
  else removeFromStorage("refresh_token");
}

export function getRefreshToken(): string | null {
  return getFromStorage("refresh_token");
}

export function clearTokens(): void {
  accessToken = null;
  removeFromStorage("access_token");
  removeFromStorage("refresh_token");
  removeFromStorage("user");
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
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = getRefreshToken();
        if (!storedRefreshToken) throw new Error("No refresh token");

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
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export { api };
