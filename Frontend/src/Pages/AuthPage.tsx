import { Box, Button, Stack, Text } from "@chakra-ui/react";

import type { Page } from "../types";

type AuthPageProps = {
  mode: "login" | "signup";
  onNavigate: (page: Page) => void;
};

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const isLogin = mode === "login";

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
          <Box
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="xl"
            px="4"
            py="3"
          >
            <Text color="gray.500">Email address</Text>
          </Box>
          <Box
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="xl"
            px="4"
            py="3"
          >
            <Text color="gray.500">Password</Text>
          </Box>

          {!isLogin && (
            <Box
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              px="4"
              py="3"
            >
              <Text color="gray.500">Company name</Text>
            </Box>
          )}

          <Button colorPalette="blue" size="lg" rounded="xl">
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
