/**
 * Compatibility shim — the single canonical API client lives in lib/api.ts.
 * (Previously two divergent copies of this client existed; keeping one source
 * of truth prevents auth-interceptor fixes from drifting.)
 */
export * from "@/lib/api";
export { api } from "@/lib/api";
