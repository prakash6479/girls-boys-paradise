import type { ApiHealth } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function fetchApiHealth(): Promise<ApiHealth> {
  const response = await fetch(`${API_BASE}/api/health`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(`API returned HTTP ${response.status}`);
  return response.json() as Promise<ApiHealth>;
}
