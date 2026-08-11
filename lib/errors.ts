interface ErrorResponseData {
  message?: string | string[];
  error?: string;
}

/**
 * Standard, user-facing error messages. Server messages are preferred when
 * they are clean; otherwise a stable fallback per status code is used so the
 * UI never surfaces raw infrastructure errors (e.g. "No refresh token
 * available") to end users.
 */
export function extractErrorMessage(error: unknown): string {
  const err = error as Record<string, unknown> | null | undefined;
  const response = err?.response as
    | { status?: number; data?: ErrorResponseData }
    | undefined;

  if (response) {
    const serverMessage = Array.isArray(response.data?.message)
      ? response.data.message[0]
      : response.data?.message;

    const status = response.status ?? 0;

    if (status === 401) {
      return cleanMessage(serverMessage) ?? "Invalid credentials. Check your email or phone and password.";
    }
    if (status === 403) {
      return cleanMessage(serverMessage) ?? "You don't have permission to do that.";
    }
    if (status === 404) {
      return "This was not found. It may have been removed.";
    }
    if (status >= 500) {
      return "Server unavailable. Please try again later.";
    }
    if (status === 400 || status === 422) {
      return cleanMessage(serverMessage) ?? "Please check the information you entered and try again.";
    }
    return cleanMessage(serverMessage) ?? "Something went wrong. Please try again.";
  }

  if (err?.code === "ECONNABORTED") return "Request timed out. Please check your connection.";
  if (err?.code === "ERR_NETWORK") return "Cannot reach the server. Check your connection and try again.";

  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

function cleanMessage(message: string | undefined): string | null {
  if (!message) return null;
  const trimmed = message.trim();
  if (!trimmed) return null;
  return trimmed;
}
