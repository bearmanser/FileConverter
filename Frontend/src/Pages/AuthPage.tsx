import { Box, Button, Field, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { StatusAlert } from "../Components/StatusAlert";
import type { AlertState, Page } from "../types";

type AuthPageProps = {
  mode: "login" | "signup";
  onNavigate: (page: Page) => void;
};

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const handleSubmit = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      (!isLogin && !companyName.trim())
    ) {
      setAlert({
        status: "error",
        title: "Missing information",
        description: isLogin
          ? "Enter both your email address and password."
          : "Enter your email, password, and company name.",
      });
      return;
    }

    setAlert(null);
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setAlert({
      status: "error",
      title: isLogin ? "Login unavailable" : "Sign up unavailable",
      description: "Something went wrong. Please try again in a moment.",
    });
    setIsSubmitting(false);
  };

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="2xl"
      p={{ base: "6", md: "8" }}
      w="full"
      maxW="520px"
      mx="auto"
    >
      <Stack gap="6">
        <Stack gap="2" textAlign="center">
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="gray.900"
          >
            {isLogin ? "Welcome back" : "Create your account"}
          </Text>
          <Text color="gray.600">
            {isLogin
              ? "Sign in to manage conversions and API usage."
              : "Join ConvertFlow and start converting files faster."}
          </Text>
        </Stack>

        <Stack gap="4">
          <StatusAlert alert={alert} />

          <Field.Root required>
            <Field.Label>Email address</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              rounded="xl"
              size="lg"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              rounded="xl"
              size="lg"
            />
          </Field.Root>

          {!isLogin && (
            <Field.Root required>
              <Field.Label>Company name</Field.Label>
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Acme Inc."
                rounded="xl"
                size="lg"
              />
            </Field.Root>
          )}

          <Button
            colorPalette="blue"
            size="lg"
            rounded="xl"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <Button
            variant="ghost"
            rounded="xl"
            onClick={() => onNavigate("home")}
          >
            Back to home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
