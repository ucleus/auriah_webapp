const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const API_PREFIX = `${API_BASE_URL}/api`;

type RequestOptions = RequestInit & { token?: string; signal?: AbortSignal };

export async function apiFetch<T>(path: string, { token, ...options }: RequestOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch (error) {
      // Ignore parse errors; default message will be used.
    }

    throw new Error(message || "Unexpected API error");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };
