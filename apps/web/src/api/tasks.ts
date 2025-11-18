import { apiFetch } from "./client";
import type { CollectionResponse, Task } from "../types/task";

export async function fetchPublicTasks(
  signal?: AbortSignal,
  limit = 24
): Promise<CollectionResponse<Task> | Task[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiFetch<CollectionResponse<Task> | Task[]>(`/public/tasks?${params.toString()}`, { signal });
}
