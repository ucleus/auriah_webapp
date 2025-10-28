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
import { Plus } from "lucide-react";

import { TASKS } from "../data/tasks";

const STATUS_LABEL: Record<(typeof TASKS)[number]["status"], string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const STATUS_COLOR: Record<(typeof TASKS)[number]["status"], string> = {
  todo: "orange",
  in_progress: "blue",
  done: "green",
};

export function TasksPage() {
  return (
    <TableContainer bg="gray.800" borderRadius="md" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Tasks</Heading>
        <Button leftIcon={<Icon as={Plus} />} colorScheme="blue">
          New task
        </Button>
      </HStack>
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
          {TASKS.map((task) => (
            <Tr key={task.id}>
              <Td>{task.title}</Td>
              <Td>{task.assignee}</Td>
              <Td>
                <Badge colorScheme={STATUS_COLOR[task.status]}>{STATUS_LABEL[task.status]}</Badge>
              </Td>
              <Td>{new Date(task.dueDate).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
