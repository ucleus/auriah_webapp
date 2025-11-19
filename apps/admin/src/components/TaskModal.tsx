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
    Textarea,
    useToast,
} from "@chakra-ui/react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PaginatedResponse, Task, User } from "../types";

type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Task | null;
};

export function TaskModal({ isOpen, onClose, onSuccess, initialData }: TaskModalProps) {
    const { token } = useAuth();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [assigneeId, setAssigneeId] = useState("");

    useEffect(() => {
        if (isOpen && token) {
            // Fetch users for dropdown
            apiFetch<PaginatedResponse<User>>("/users?per_page=100", { token })
                .then((res) => setUsers(res.data))
                .catch((err) => console.error("Failed to load users", err));

            if (initialData) {
                // Populate form for editing
                setTitle(initialData.title);
                setDescription(initialData.description || "");
                setStatus(initialData.status);
                setPriority(initialData.priority);
                setDueDate(initialData.due_date || "");
                setAssigneeId(initialData.assignee?.id.toString() || "");
            } else {
                // Reset form for creation
                setTitle("");
                setDescription("");
                setStatus("todo");
                setPriority("medium");
                setDueDate("");
                setAssigneeId("");
            }
        }
    }, [isOpen, token, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            setIsSubmitting(true);
            const url = initialData ? `/tasks/${initialData.id}` : "/tasks";
            const method = initialData ? "PUT" : "POST";

            await apiFetch<Task>(url, {
                method,
                token,
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    priority,
                    due_date: dueDate || null,
                    assignee_id: assigneeId ? Number(assigneeId) : null,
                }),
            });

            toast({
                title: initialData ? "Task updated." : "Task created.",
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
                    <ModalHeader>{initialData ? "Edit Task" : "Create New Task"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormControl isRequired mb={4}>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Task title"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Details about the task..."
                                        rows={8}
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormControl mb={4}>
                                    <FormLabel>Status</FormLabel>
                                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="in_review">In Review</option>
                                        <option value="done">Done</option>
                                    </Select>
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Priority</FormLabel>
                                    <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </Select>
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Due Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Assignee</FormLabel>
                                    <Select
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        placeholder="Select assignee"
                                    >
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
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
                            {initialData ? "Update Task" : "Create Task"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
