import { apiFetch } from "./client";

export type SearchResult = {
  id: string;
  type: string;
  title: string;
  snippet: string;
  url: string;
  metadata?: Record<string, unknown>;
};

export type SearchResponse = {
  query: string;
  total: number;
  results: SearchResult[];
};

export async function fetchSearchResults(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query: "", total: 0, results: [] };
  }

  const params = new URLSearchParams({ q: trimmed, limit: "12" });
  return apiFetch<SearchResponse>(`/search?${params.toString()}`, { signal });
}

export async function fetchSearchSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
  const params = new URLSearchParams({ limit: "6" });
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const response = await apiFetch<{ query: string; suggestions: string[] }>(
    `/search/suggestions?${params.toString()}`,
    { signal }
  );

  return response.suggestions;
}

export async function fetchInspirationPrompts(signal?: AbortSignal): Promise<string[]> {
  const response = await apiFetch<{ prompts: string[] }>("/search/inspirations?limit=10", { signal });
  return response.prompts;
}
