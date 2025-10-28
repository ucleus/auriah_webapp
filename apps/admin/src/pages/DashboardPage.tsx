import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PaginatedResponse, Task, User } from "../types";

export function DashboardPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
        const [taskResponse, userResponse] = await Promise.all([
          apiFetch<PaginatedResponse<Task>>("/tasks?per_page=100", { token: authToken, signal: controller.signal }),
          apiFetch<PaginatedResponse<User>>("/users?per_page=100", { token: authToken, signal: controller.signal }),
        ]);
        setTasks(taskResponse.data);
        setUsers(userResponse.data);
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

  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const activeTasks = totalTasks - completed;
    const completion = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);
    const invitesPending = users.filter((user) => user.status === "invited").length;

    return { totalTasks, completed, activeTasks, completion, invitesPending };
  }, [tasks, users]);

  return (
    <Grid templateColumns={{ base: "1fr", lg: "2fr 3fr" }} gap={8}>
      <GridItem>
        <Heading size="md" mb={4}>
          Quick summary
        </Heading>
        {error && (
          <Text color="red.300" mb={4} role="alert">
            {error}
          </Text>
        )}
        {loading && (
          <HStack spacing={3} mb={4}>
            <Spinner size="sm" />
            <Text color="gray.300">Fetching the latest metrics…</Text>
          </HStack>
        )}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Active tasks</StatLabel>
            <StatNumber>{metrics.activeTasks}</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Team members</StatLabel>
            <StatNumber>{users.length}</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Completion</StatLabel>
            <StatNumber>{metrics.completion}%</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Invites pending</StatLabel>
            <StatNumber>{metrics.invitesPending}</StatNumber>
          </Stat>
        </SimpleGrid>
      </GridItem>
      <GridItem>
        <Box bg="gray.800" borderRadius="md" p={6}>
          <Heading size="sm" mb={4}>
            Roadmap progress
          </Heading>
          <Text color="gray.400" mb={4}>
            OTP login, search analytics, and task automation are the current focus. Monitor the adoption score as new features
            roll out to the family group.
          </Text>
          <Progress value={metrics.completion} colorScheme="blue" borderRadius="full" />
        </Box>
      </GridItem>
    </Grid>
  );
}
