import {
    Box,
    Button,
    Container,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useDisclosure,
    useToast,
    HStack,
    Checkbox,
} from "@chakra-ui/react";
import { Cloud, Play, Upload, Settings, Save } from "lucide-react";
import { useState } from "react";
import { GoogleDriveModal } from "../components/GoogleDriveModal";

// Mock data for Drive items
const DRIVE_ITEMS = [
    {
        id: 1,
        type: "image",
        name: "Mountain Adventure.jpg",
        src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
        size: "2.4 MB",
    },
    {
        id: 2,
        type: "video",
        name: "Family Trip.mp4",
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
        size: "15.8 MB",
    },
    {
        id: 3,
        type: "image",
        name: "Sunset View.jpg",
        src: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
        size: "1.8 MB",
    },
    {
        id: 4,
        type: "image",
        name: "Forest Hike.jpg",
        src: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b",
        size: "3.2 MB",
    },
];

export function MediaPage() {
    const toast = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([1, 3])); // Mock initial selection

    const handleDriveConnected = () => {
        // Refresh drive items or update UI state
        console.log("Drive connected");
    };

    const toggleSelection = (id: number) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedItems(newSelection);
    };

    const handleSaveSelection = () => {
        toast({
            title: "Selection saved",
            description: "Public media gallery has been updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            setIsUploading(false);
            toast({
                title: "Upload complete",
                description: "Your files have been uploaded to Google Drive.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }, 2000);
    };

    return (
        <Container maxW="container.xl">
            <HStack justify="space-between" mb={6}>
                <Heading>Media Manager</Heading>
                <HStack>
                    <Button leftIcon={<Icon as={Save} />} colorScheme="blue" onClick={handleSaveSelection}>
                        Save Changes
                    </Button>
                    <Button leftIcon={<Icon as={Settings} />} onClick={onOpen} size="sm" variant="outline">
                        Connect Drive
                    </Button>
                </HStack>
            </HStack>

            <Tabs variant="enclosed" colorScheme="blue">
                <TabList>
                    <Tab><Icon as={Cloud} mr={2} /> Drive Library</Tab>
                    <Tab><Icon as={Upload} mr={2} /> Upload</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
                            {DRIVE_ITEMS.map((item) => (
                                <GridItem
                                    key={item.id}
                                    bg="gray.800"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    borderWidth="1px"
                                    borderColor="gray.700"
                                    transition="all 0.2s"
                                    _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                                    onClick={() => toggleSelection(item.id)}
                                    cursor="pointer"
                                    position="relative"
                                    borderColor={selectedItems.has(item.id) ? "blue.500" : "gray.700"}
                                    borderWidth={selectedItems.has(item.id) ? "2px" : "1px"}
                                >
                                    <Box position="absolute" top={2} right={2} zIndex={2}>
                                        <Checkbox
                                            isChecked={selectedItems.has(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            colorScheme="blue"
                                            size="lg"
                                            sx={{
                                                '[data-checked]': {
                                                    borderColor: 'blue.500',
                                                    bg: 'blue.500',
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box position="relative" paddingTop="75%">
                                        {item.type === "video" ? (
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                bg="black"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Icon as={Play} boxSize={8} color="whiteAlpha.800" />
                                            </Box>
                                        ) : (
                                            <Image
                                                src={item.src}
                                                alt={item.name}
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                            />
                                        )}
                                    </Box>
                                    <Box p={3}>
                                        <Text fontWeight="medium" noOfLines={1} mb={1}>
                                            {item.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.400">
                                            {item.size}
                                        </Text>
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        <Box
                            borderWidth="2px"
                            borderStyle="dashed"
                            borderColor="gray.600"
                            borderRadius="xl"
                            p={10}
                            textAlign="center"
                            bg="gray.800"
                        >
                            <VStack spacing={4}>
                                <Icon as={Cloud} boxSize={12} color="blue.400" />
                                <Heading size="md">Upload to Google Drive</Heading>
                                <Text color="gray.400">
                                    Drag and drop files here, or click to select files
                                </Text>
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={handleUpload}
                                    isLoading={isUploading}
                                    loadingText="Uploading..."
                                    leftIcon={<Icon as={Upload} />}
                                >
                                    Select Files
                                </Button>
                            </VStack>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>


            <GoogleDriveModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={handleDriveConnected}
            />
        </Container >
    );
}
