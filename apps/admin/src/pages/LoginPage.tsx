import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { requestOtp, verifyOtp, user } = useAuth();
  const [email, setEmail] = useState("fiv4lab@gmail.com");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function handleRequest() {
    try {
      setLoading(true);
      setError(null);
      setInfo(null);
      const response = await requestOtp(email);
      if (response.demoCode) {
        setInfo(`Demo code: ${response.demoCode}`);
      } else {
        setInfo("A one-time code has been sent. Enter it below to continue.");
      }
      setStep("verify");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    try {
      setLoading(true);
      setError(null);
      await verifyOtp(email, code);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FlexShell>
      <VStack spacing={6} maxW="420px" w="full" align="stretch">
        <Heading size="lg">Auirah Admin</Heading>
        <Text color="gray.400">
          Secure access with a time-sensitive passcode. Request a code to receive it via the configured channel.
        </Text>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}
        {info && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        )}
        <Stack spacing={4} as="form" onSubmit={(event) => event.preventDefault()}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </FormControl>
          {step === "verify" && (
            <FormControl>
              <FormLabel>One-time passcode</FormLabel>
              <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="123456" required />
            </FormControl>
          )}
          {step === "request" ? (
            <Button onClick={handleRequest} isLoading={loading} colorScheme="blue">
              Send code
            </Button>
          ) : (
            <Button onClick={handleVerify} isLoading={loading} colorScheme="blue">
              Verify and continue
            </Button>
          )}
        </Stack>
      </VStack>
    </FlexShell>
  );
}

function FlexShell({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.900" color="gray.50" display="grid" placeItems="center" px={4}>
      {children}
    </Box>
  );
}
