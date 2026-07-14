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
    const token = getAccessToken();
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

    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const storedRefreshToken = getRefreshToken();
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

export { api };
