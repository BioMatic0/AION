const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const candidate = (payload as { message?: unknown }).message;

    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is string => typeof item === "string").join(" ");
    }

    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return fallback;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const headers = new Headers(init?.headers);
    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
    const contentType = response.headers.get("content-type") ?? "";

    let payload: unknown = null;
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text.length > 0 ? text : null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: extractErrorMessage(payload, `API request failed with status ${response.status}.`)
      };
    }

    return {
      ok: true,
      status: response.status,
      data: payload as T,
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : "API request failed before a response was received."
    };
  }
}
