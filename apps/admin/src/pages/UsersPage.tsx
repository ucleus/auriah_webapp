import {
  Badge,
  Button,
  HStack,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { UserPlus } from "lucide-react";

import { USERS } from "../data/users";

export function UsersPage() {
  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Users</Heading>
        <Button leftIcon={<Icon as={UserPlus} />} colorScheme="blue">
          Invite user
        </Button>
      </HStack>
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
          {USERS.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>
                <Badge colorScheme={user.status === "active" ? "green" : "yellow"}>{user.status}</Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
