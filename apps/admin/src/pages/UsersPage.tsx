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
import { UserPlus } from "lucide-react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PaginatedResponse, User } from "../types";

const STATUS_COLOR: Record<User["status"], string> = {
  active: "green",
  invited: "yellow",
};

export function UsersPage() {
  const { token } = useAuth();
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
        const response = await apiFetch<PaginatedResponse<User>>("/users?per_page=50", {
          token: authToken,
          signal: controller.signal,
        });
        setUsers(response.data);
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

  const emptyState = useMemo(() => !loading && users.length === 0, [loading, users.length]);

  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Users</Heading>
        <Button leftIcon={<Icon as={UserPlus} />} colorScheme="blue" variant="outline">
          Invite user
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
          <Text color="gray.300">Loading users…</Text>
        </HStack>
      )}
      {emptyState ? (
        <Text color="gray.400">No team members yet. Invite collaborators to get started.</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td textTransform="capitalize">{user.role}</Td>
                <Td>
                  <Badge colorScheme={STATUS_COLOR[user.status]}>{user.status}</Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
}
