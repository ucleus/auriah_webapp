import {
  Box,
  Grid,
  GridItem,
  Heading,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";

import { TASKS } from "../data/tasks";
import { USERS } from "../data/users";

export function DashboardPage() {
  const activeTasks = TASKS.filter((task) => task.status !== "done").length;
  const completion = Math.round((TASKS.filter((task) => task.status === "done").length / TASKS.length) * 100);

  return (
    <Grid templateColumns={{ base: "1fr", lg: "2fr 3fr" }} gap={8}>
      <GridItem>
        <Heading size="md" mb={4}>
          Quick summary
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Active tasks</StatLabel>
            <StatNumber>{activeTasks}</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Team members</StatLabel>
            <StatNumber>{USERS.length}</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Completion</StatLabel>
            <StatNumber>{completion}%</StatNumber>
          </Stat>
          <Stat bg="gray.800" borderRadius="md" p={4}>
            <StatLabel>Invites pending</StatLabel>
            <StatNumber>{USERS.filter((user) => user.status === "invited").length}</StatNumber>
          </Stat>
        </SimpleGrid>
      </GridItem>
      <GridItem>
        <Box bg="gray.800" borderRadius="md" p={6}>
          <Heading size="sm" mb={4}>
            Roadmap progress
          </Heading>
          <Text color="gray.400" mb={4}>
            OTP login, search analytics, and task automation are the current focus. Monitor the adoption score as new features roll
            out to the family group.
          </Text>
          <Progress value={completion} colorScheme="blue" borderRadius="full" />
        </Box>
      </GridItem>
    </Grid>
  );
}
