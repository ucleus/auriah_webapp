import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LogOut, Menu, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Overview", icon: ShieldCheck },
  { to: "/tasks", label: "Tasks", icon: Menu },
  { to: "/users", label: "Users", icon: Users },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Flex minH="100vh" bg="gray.900" color="gray.50">
      <Box
        as="nav"
        w={{ base: "full", md: "260px" }}
        borderRightWidth="1px"
        borderColor="gray.700"
        px="6"
        py="8"
        display="flex"
        flexDirection="column"
        gap="8"
        bg="gray.950"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Auirah Admin
        </Text>
        <VStack align="stretch" spacing={3}>
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} style={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  gap={3}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight={isActive ? "semibold" : "medium"}
                  bg={isActive ? "blue.500" : "transparent"}
                  color={isActive ? "white" : "gray.200"}
                  _hover={{ bg: isActive ? "blue.500" : "gray.800", color: "white" }}
                >
                  <Icon as={item.icon} boxSize={4} />
                  {item.label}
                </Flex>
              </NavLink>
            );
          })}
        </VStack>
        <Box mt="auto" borderTopWidth="1px" borderColor="gray.800" pt={4}>
          <HStack spacing={3} align="center">
            <Avatar name={user?.email ?? "Owner"} size="sm" bg="blue.500" />
            <Box>
              <Text fontSize="sm" fontWeight="semibold">
                {user?.email}
              </Text>
              <Text fontSize="xs" color="gray.400">
                Role: {user?.role}
              </Text>
            </Box>
          </HStack>
          <Button mt={4} size="sm" variant="outline" onClick={logout} leftIcon={<LogOut size={16} />}>
            Sign out
          </Button>
        </Box>
      </Box>
      <Flex direction="column" flex="1">
        <Flex
          as="header"
          px={{ base: 4, md: 8 }}
          py={4}
          borderBottomWidth="1px"
          borderColor="gray.700"
          align="center"
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="semibold">
            {navLinks.find((link) => link.to === location.pathname)?.label ?? "Overview"}
          </Text>
          <HStack spacing={4}>
            <IconButton aria-label="Support" icon={<ShieldCheck size={18} />} variant="outline" />
            <IconButton aria-label="Open navigation" icon={<Menu size={18} />} variant="outline" />
          </HStack>
        </Flex>
        <Box as="main" flex="1" px={{ base: 4, md: 8 }} py={8} bg="gray.900">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
