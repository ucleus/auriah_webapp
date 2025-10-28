export type Task = {
  id: number;
  title: string;
  assignee: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string;
};

export const TASKS: Task[] = [
  { id: 1, title: "Design onboarding flow", assignee: "Asha", status: "in_progress", dueDate: "2025-10-30" },
  { id: 2, title: "Implement global search API", assignee: "Sean", status: "todo", dueDate: "2025-11-02" },
  { id: 3, title: "QA accessibility sweep", assignee: "Jordan", status: "done", dueDate: "2025-10-25" },
];
