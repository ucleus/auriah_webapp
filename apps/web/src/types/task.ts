export type Role = "owner" | "admin" | "family" | "viewer";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone_number: string | null;
  status: "active" | "invited";
  email_verified_at: string | null;
  otp_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type Task = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  labels: string[];
  summary: string;
  owner: User;
  assignee: User | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CollectionResponse<T> = {
  data: T[];
  meta?: Record<string, unknown>;
  links?: Record<string, unknown>;
};
