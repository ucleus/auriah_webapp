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
import { MoreHorizontal, UserPlus, Pencil, Trash2 } from "lucide-react";
import { UserModal } from "../components/UserModal";

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


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const toast = useToast();

  const handleCreate = () => {
    setEditingUser(null);
    onOpen();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    onOpen();
  };

  const handleDelete = async (userId: number) => {
    if (!token || !window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await apiFetch(`/users/${userId}`, {
        method: "DELETE",
        token,
      });
      toast({
        title: "User removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (err) {
      toast({
        title: "Failed to remove user.",
        description: (err as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async (signal?: AbortSignal) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch<PaginatedResponse<User>>("/users?per_page=50", {
        token,
        signal,
      });
      setUsers(response.data);
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
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [token]);

  const emptyState = useMemo(() => !loading && users.length === 0, [loading, users.length]);

  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Users</Heading>
        <Button leftIcon={<Icon as={UserPlus} />} colorScheme="blue" variant="outline" onClick={handleCreate}>
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
              <Th width="50px"></Th>
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
                      <MenuItem icon={<Pencil size={14} />} onClick={() => handleEdit(user)} bg="transparent" _hover={{ bg: "gray.600" }}>
                        Edit
                      </MenuItem>
                      <MenuItem icon={<Trash2 size={14} />} onClick={() => handleDelete(user.id)} color="red.300" bg="transparent" _hover={{ bg: "gray.600" }}>
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
      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => fetchUsers()}
        initialData={editingUser}
      />
    </TableContainer>
  );
}
