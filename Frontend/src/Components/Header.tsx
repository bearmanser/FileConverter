import { Box, Button, Container, HStack, Stack, Text } from "@chakra-ui/react";

import type { Page } from "../types";

type HeaderProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems: Array<{ label: string; page: Page }> = [
    { label: "Home", page: "home" },
    { label: "API Docs", page: "api-docs" },
    { label: "Pricing", page: "pricing" },
  ];

  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Container maxW="7xl" py="4">
        <HStack justify="space-between" gap="6" flexWrap="wrap">
          <HStack gap="8" flex="1" minW="0">
            <HStack gap="3" cursor="pointer" onClick={() => onNavigate("home")}>
              <Box
                w="10"
                h="10"
                rounded="xl"
                bg="blue.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize="md"
              >
                C
              </Box>
              <Stack gap="0">
                <Text fontSize="lg" fontWeight="bold" color="gray.900">
                  ConvertFlow
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Simple file conversion
                </Text>
              </Stack>
            </HStack>

            <HStack gap="2" flexWrap="wrap">
              {navItems.map((item) => {
                const active = currentPage === item.page;

                return (
                  <Button
                    key={item.page}
                    variant={active ? "solid" : "ghost"}
                    colorPalette={active ? "blue" : undefined}
                    rounded="xl"
                    onClick={() => onNavigate(item.page)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </HStack>
          </HStack>

          <HStack gap="3">
            <Button
              variant="subtle"
              colorPalette="blue"
              rounded="xl"
              onClick={() => onNavigate("login")}
            >
              Login
            </Button>
            <Button
              colorPalette="blue"
              rounded="xl"
              onClick={() => onNavigate("signup")}
            >
              Sign Up
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
