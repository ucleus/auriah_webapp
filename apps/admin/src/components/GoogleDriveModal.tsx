import { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useToast,
    Text,
} from "@chakra-ui/react";

type GoogleDriveModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export function GoogleDriveModal({ isOpen, onClose, onSuccess }: GoogleDriveModalProps) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [clientId, setClientId] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [redirectUri, setRedirectUri] = useState("http://localhost:3000/auth/google/callback");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        // Simulate API call to save credentials/connect
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Drive Connected",
                description: "Your Google Drive account has been successfully linked.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
            onClose();
        }, 1500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent bg="gray.800" color="white">
                <form onSubmit={handleSubmit}>
                    <ModalHeader>Connect Google Drive</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Text fontSize="sm" color="gray.400">
                                Enter your Google Cloud Console credentials to enable Drive integration.
                            </Text>

                            <FormControl isRequired>
                                <FormLabel>Client ID</FormLabel>
                                <Input
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    placeholder="Enter Client ID"
                                    type="password"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>API Key</FormLabel>
                                <Input
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter API Key"
                                    type="password"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Redirect URI</FormLabel>
                                <Input
                                    value={redirectUri}
                                    isReadOnly
                                    bg="gray.700"
                                    color="gray.400"
                                    cursor="not-allowed"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                            Connect
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
