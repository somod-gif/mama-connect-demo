import { toast } from "sonner";

const errorMessages: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Session expired. Please sign in again.",
  403: "You don't have permission to perform this action.",
  404: "Resource not found.",
  409: "This action conflicts with the current state.",
  422: "Please check your input and try again.",
  429: "Too many requests. Please wait a moment.",
  500: "Server unavailable. Please try again later.",
  502: "Server is temporarily unavailable.",
  503: "Service is temporarily unavailable.",
};

export function handleApiError(error: unknown): string {
  const err = error as Record<string, unknown> | null | undefined;

  if (err?.response && typeof err.response === "object") {
    const resp = err.response as Record<string, unknown>;
    const status = resp.status as number | undefined;
    const data = resp.data as Record<string, unknown> | undefined;

    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    if (data?.error && typeof data.error === "string") {
      return data.error;
    }
    if (status && errorMessages[status]) {
      return errorMessages[status];
    }
  }

  if (err?.code === "ECONNABORTED") {
    return "Request timed out. Please check your connection.";
  }
  if (err?.code === "ERR_NETWORK") {
    return "Network error. Please check your connection.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export function showApiError(error: unknown): void {
  const message = handleApiError(error);
  toast.error(message);
}
