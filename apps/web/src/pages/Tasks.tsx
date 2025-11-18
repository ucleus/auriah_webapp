import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";

import { PageLayout } from "../components/PageLayout";
import { fetchPublicTasks } from "../api/tasks";
import type { Task, TaskStatus } from "../types/task";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Completed",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "#f97316",
  in_progress: "#38bdf8",
  in_review: "#c084fc",
  done: "#2cb67d",
};

type DecoratedTask = Task & {
  isCompleted: boolean;
  isOverdue: boolean;
  dueLabel: string;
  dueDateValue: number;
};

const dueDateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const updatedFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const actionTimeout = useRef<number | null>(null);
  const primaryActionRef = useRef<HTMLButtonElement | null>(null);

  const decorateTasks = useCallback((taskList: Task[] = []): DecoratedTask[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return taskList
      .map((task) => {
        const dueDate = task.due_date ? new Date(`${task.due_date}T00:00:00`) : null;
        const isCompleted = Boolean(task.completed_at || task.status === "done");
        const isOverdue = Boolean(dueDate && !isCompleted && dueDate.getTime() < today.getTime());
        const dueDateValue = dueDate ? dueDate.getTime() : Number.POSITIVE_INFINITY;

        return Object.assign({}, task, {
          isCompleted,
          isOverdue,
          dueLabel: dueDate ? dueDateFormat.format(dueDate) : "No due date",
          dueDateValue,
        });
      })
      .sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) {
          return a.isOverdue ? -1 : 1;
        }

        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }

        if (a.dueDateValue !== b.dueDateValue) {
          return a.dueDateValue - b.dueDateValue;
        }

        const aUpdated = new Date((a.updated_at ?? a.created_at) ?? 0).getTime();
        const bUpdated = new Date((b.updated_at ?? b.created_at) ?? 0).getTime();
        return bUpdated - aUpdated;
      });
  }, []);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchPublicTasks(signal);
        if (signal?.aborted) return;
        setTasks(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        if ((err as Error).name === "AbortError" || signal?.aborted) {
          return;
        }
        setError((err as Error).message);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const decoratedTasks = useMemo(() => decorateTasks(tasks), [decorateTasks, tasks]);
  const selectedTask = useMemo(
    () => decoratedTasks.find((task) => task.id === selectedTaskId) ?? null,
    [decoratedTasks, selectedTaskId]
  );

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTaskId(null);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask && primaryActionRef.current) {
      primaryActionRef.current.focus();
    }
  }, [selectedTask]);

  useEffect(() => {
    return () => {
      if (actionTimeout.current !== null) {
        window.clearTimeout(actionTimeout.current);
      }
    };
  }, []);

  const handleAction = (action: string) => {
    if (!selectedTask) return;
    if (actionTimeout.current !== null) {
      window.clearTimeout(actionTimeout.current);
    }

    setActionMessage(`${action} for “${selectedTask.title}” is queued`);
    actionTimeout.current = window.setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  const handleRefresh = () => fetchData();
  const handleCreateClick = () => {
    if (actionTimeout.current !== null) {
      window.clearTimeout(actionTimeout.current);
    }
    setActionMessage("Task creation lives in the admin console. Coming soon to this page!");
    actionTimeout.current = window.setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  return (
    <>
      <PageLayout title="Tasks" description="Plan projects, routines, and quick reminders in one place.">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2 size={20} />
          <div>
            <strong>Live task tracker</strong>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Pulls directly from the shared workspace database.
            </p>
          </div>
        </div>

        <div className="task-controls">
          <button className="btn" type="button" onClick={handleCreateClick}>
            <PlusCircle size={16} style={{ marginRight: "8px" }} />
            Add new task
          </button>
          <button className="btn" type="button" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={16} style={{ marginRight: "8px" }} />
            Refresh
          </button>
        </div>

        {actionMessage && (
          <p className="task-inline-message" role="status">
            {actionMessage}
          </p>
        )}

        {error && (
          <p className="task-error" role="alert">
            <AlertCircle size={16} style={{ marginRight: "6px" }} />
            {error}
          </p>
        )}

        {loading && (
          <p style={{ color: "var(--muted)" }}>
            Syncing with the workspace…
          </p>
        )}

        {!loading && decoratedTasks.length === 0 && !error && (
          <p style={{ color: "var(--muted)" }}>No tasks yet. Add one from the admin dashboard.</p>
        )}

        {decoratedTasks.length > 0 && (
          <div className="task-grid" role="list">
            {decoratedTasks.map((task) => {
              const statusColor = STATUS_COLOR[task.status];
              return (
                <button
                  key={task.id}
                  type="button"
                  className={[
                    "task-card",
                    task.isOverdue ? "task-card--overdue" : "",
                    task.isCompleted ? "task-card--completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    setSelectedTaskId((current) => (current === task.id ? null : task.id))
                  }
                  aria-pressed={selectedTaskId === task.id}
                  role="listitem"
                >
                  <div className="task-card__header">
                    <div>
                      <p className="task-label">Task</p>
                      <h3>{task.title}</h3>
                    </div>
                    <span
                      className="task-status-pill"
                      style={{
                        color: statusColor,
                        borderColor: `${statusColor}33`,
                        background: `${statusColor}14`,
                      }}
                    >
                      {STATUS_LABEL[task.status]}
                    </span>
                  </div>

                  <div className="task-card__meta">
                    <div>
                      <p className="task-label">Assignee</p>
                      <p className="task-value">{task.assignee?.name ?? "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="task-label">Due</p>
                      <p className="task-value">{task.dueLabel}</p>
                    </div>
                  </div>

                  {task.isOverdue && (
                    <span className="task-warning">
                      <AlertCircle size={14} />
                      Overdue
                    </span>
                  )}
                  {task.isCompleted && (
                    <span className="task-success">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </PageLayout>

      {selectedTask && (
        <div className="task-modal-overlay" role="presentation" onClick={() => setSelectedTaskId(null)}>
          <div
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="task-modal-close"
              aria-label="Close task details"
              onClick={() => setSelectedTaskId(null)}
            >
              <X size={16} />
            </button>
            <h2 id="task-modal-title">{selectedTask.title}</h2>
            <p className="task-modal-subtitle">{selectedTask.description ?? selectedTask.summary}</p>

            <div className="task-modal-grid">
              <div>
                <p className="task-label">Status</p>
                <span
                  className="task-status-pill"
                  style={{
                    color: STATUS_COLOR[selectedTask.status],
                    borderColor: `${STATUS_COLOR[selectedTask.status]}33`,
                    background: `${STATUS_COLOR[selectedTask.status]}14`,
                  }}
                >
                  {STATUS_LABEL[selectedTask.status]}
                </span>
              </div>
              <div>
                <p className="task-label">Assignee</p>
                <p className="task-value with-icon">
                  <UserRound size={14} />
                  {selectedTask.assignee?.name ?? "Unassigned"}
                </p>
              </div>
              <div>
                <p className="task-label">Due date</p>
                <p className="task-value with-icon">
                  <CalendarDays size={14} />
                  {selectedTask.dueLabel}
                </p>
              </div>
              <div>
                <p className="task-label">Owner</p>
                <p className="task-value">{selectedTask.owner.name}</p>
              </div>
              <div>
                <p className="task-label">Priority</p>
                <p className="task-value task-priority">{selectedTask.priority}</p>
              </div>
              <div>
                <p className="task-label">Updated</p>
                <p className="task-value">
                  {selectedTask.updated_at ? updatedFormat.format(new Date(selectedTask.updated_at)) : "—"}
                </p>
              </div>
            </div>

            {selectedTask.labels.length > 0 && (
              <div className="task-labels">
                {selectedTask.labels.map((label, index) => (
                  <span key={`${selectedTask.id}-${label}-${index}`}>{label}</span>
                ))}
              </div>
            )}

            <div className="task-modal-actions">
              <button
                ref={primaryActionRef}
                type="button"
                onClick={() =>
                  handleAction(selectedTask.isCompleted ? "Reopened task" : "Marked complete")
                }
              >
                {selectedTask.isCompleted ? "Reopen task" : "Mark as done"}
              </button>
              <button type="button" onClick={() => handleAction("Reminder scheduled")}>
                Schedule reminder
              </button>
              <button type="button" onClick={() => handleAction("Shared task link")}>
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
