import { useEffect, useMemo, useState } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  Badge,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { MoreHorizontal, Plus, Trash2, Pencil } from "lucide-react";

import { apiFetch } from "../api/client";
import { TaskModal } from "../components/TaskModal";
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const toast = useToast();

  const handleCreate = () => {
    setEditingTask(null);
    onOpen();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleDelete = async (taskId: number) => {
    if (!token || !window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });
      toast({
        title: "Task deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchTasks();
    } catch (err) {
      toast({
        title: "Failed to delete task.",
        description: (err as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTasks = async (signal?: AbortSignal) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch<PaginatedResponse<Task>>("/tasks?per_page=50", {
        token,
        signal,
      });
      setTasks(response.data);
    } catch (err) {
      if (!signal?.aborted) {
        setError((err as Error).message);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller.signal);
    return () => controller.abort();
  }, [token]);

  const emptyState = useMemo(() => !loading && tasks.length === 0, [loading, tasks.length]);

  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Tasks</Heading>
        <Button leftIcon={<Icon as={Plus} />} colorScheme="blue" variant="outline" onClick={handleCreate}>
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
              <Th width="50px"></Th>
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
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreHorizontal size={16} />}
                      variant="ghost"
                      size="sm"
                      aria-label="Actions"
                    />
                    <MenuList bg="gray.700" borderColor="gray.600">
                      <MenuItem icon={<Pencil size={14} />} onClick={() => handleEdit(task)} bg="transparent" _hover={{ bg: "gray.600" }}>
                        Edit
                      </MenuItem>
                      <MenuItem icon={<Trash2 size={14} />} onClick={() => handleDelete(task.id)} color="red.300" bg="transparent" _hover={{ bg: "gray.600" }}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <TaskModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => fetchTasks()}
        initialData={editingTask}
      />
    </TableContainer>
  );
}
