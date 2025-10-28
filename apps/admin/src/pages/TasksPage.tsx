import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  HStack,
  Heading,
  Icon,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PaginatedResponse, Task, TaskStatus } from "../types";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "orange",
  in_progress: "blue",
  in_review: "purple",
  done: "green",
};

const formatDate = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch<PaginatedResponse<Task>>("/tasks?per_page=50", {
          token: authToken,
          signal: controller.signal,
        });
        setTasks(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError((err as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [token]);

  const emptyState = useMemo(() => !loading && tasks.length === 0, [loading, tasks.length]);

  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Tasks</Heading>
        <Button leftIcon={<Icon as={Plus} />} colorScheme="blue" variant="outline">
          New task
        </Button>
      </HStack>
      {error && (
        <Text color="red.300" mb={4} role="alert">
          {error}
        </Text>
      )}
      {loading && (
        <HStack spacing={3} mb={4}>
          <Spinner size="sm" />
          <Text color="gray.300">Loading tasks…</Text>
        </HStack>
      )}
      {emptyState ? (
        <Text color="gray.400">No tasks yet. Create your first task to populate the workspace.</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Task</Th>
              <Th>Assignee</Th>
              <Th>Status</Th>
              <Th>Due</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td>{task.title}</Td>
                <Td>{task.assignee?.name ?? "Unassigned"}</Td>
                <Td>
                  <Badge colorScheme={STATUS_COLOR[task.status]}>{STATUS_LABEL[task.status]}</Badge>
                </Td>
                <Td>{task.due_date ? formatDate.format(new Date(task.due_date)) : "—"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
}
