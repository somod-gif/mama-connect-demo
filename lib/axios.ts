import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mamaconnect.ng/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("mamaconnect_token");
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("mamaconnect_refresh_token");
  } catch {
    return null;
  }
}

function setTokens(token: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("mamaconnect_token", token);
  localStorage.setItem("mamaconnect_refresh_token", refreshToken);
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("mamaconnect_token");
  localStorage.removeItem("mamaconnect_refresh_token");
  localStorage.removeItem("mamaconnect_user");
  localStorage.removeItem("mamaconnect_remember");
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        setTokens(newToken, newRefreshToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/chew/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient, getToken, setTokens, clearTokens, getRefreshToken };
export type { AxiosRequestConfig };
