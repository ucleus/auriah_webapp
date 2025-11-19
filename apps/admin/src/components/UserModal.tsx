import { useEffect, useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    useToast,
} from "@chakra-ui/react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

type UserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: User | null;
};

export function UserModal({ isOpen, onClose, onSuccess, initialData }: UserModalProps) {
    const { token } = useAuth();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [status, setStatus] = useState("invited");

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form for editing
                setName(initialData.name);
                setEmail(initialData.email);
                setRole(initialData.role);
                setPhoneNumber(initialData.phone_number || "");
                setStatus(initialData.status);
            } else {
                // Reset form for creation
                setName("");
                setEmail("");
                setRole("viewer");
                setPhoneNumber("");
                setStatus("invited");
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            setIsSubmitting(true);
            const url = initialData ? `/users/${initialData.id}` : "/users";
            const method = initialData ? "PUT" : "POST";

            await apiFetch<User>(url, {
                method,
                token,
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    phone_number: phoneNumber || null,
                    status,
                }),
            });

            toast({
                title: initialData ? "User updated." : "User invited.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onSuccess();
            onClose();
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent bg="gray.800" color="white">
                <form onSubmit={handleSubmit}>
                    <ModalHeader>{initialData ? "Edit User" : "Invite User"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormControl isRequired mb={4}>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full name"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormControl mb={4}>
                                    <FormLabel>Role</FormLabel>
                                    <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="owner">Owner</option>
                                        <option value="admin">Admin</option>
                                        <option value="family">Family</option>
                                        <option value="viewer">Viewer</option>
                                    </Select>
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Optional"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="invited">Invited</option>
                                    </Select>
                                </FormControl>
                            </GridItem>
                        </Grid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                            {initialData ? "Update User" : "Send Invitation"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
