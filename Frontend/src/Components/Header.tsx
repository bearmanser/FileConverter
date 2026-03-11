import { Box, Button, Container, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type { Page } from "../types";

type HeaderProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: Array<{ label: string; page: Page }> = [
    { label: "Home", page: "home" },
    { label: "API Docs", page: "api-docs" },
    { label: "Pricing", page: "pricing" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

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
      <Container maxW="7xl" py={{ base: "3", md: "4" }}>
        <Stack gap={{ base: "3", md: "4" }}>
          <HStack justify="space-between" gap="4" align="center">
            <HStack
              gap="3"
              minW="0"
              flex="1"
              cursor="pointer"
              onClick={() => handleNavigate("home")}
            >
              <Stack gap="0" minW="0">
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.900">
                  FileConvert
                </Text>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  lineClamp={1}
                >
                  Simple file conversion
                </Text>
              </Stack>
            </HStack>

            <HStack
              gap="3"
              flex="1"
              justify="center"
              display={{ base: "none", md: "flex" }}
            >
              {navItems.map((item) => {
                const active = currentPage === item.page;

                return (
                  <Button
                    key={item.page}
                    variant={active ? "solid" : "ghost"}
                    colorPalette={active ? "blue" : undefined}
                    rounded="xl"
                    onClick={() => handleNavigate(item.page)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </HStack>

            <Button
              display={{ base: "inline-flex", md: "none" }}
              variant={isMenuOpen ? "solid" : "outline"}
              colorPalette="blue"
              rounded="xl"
              minW="88px"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </Button>

            <HStack gap="3" display={{ base: "none", md: "flex" }}>
              <Button
                variant="subtle"
                colorPalette="blue"
                rounded="xl"
                onClick={() => handleNavigate("login")}
              >
                Login
              </Button>
              <Button colorPalette="blue" rounded="xl" onClick={() => handleNavigate("signup")}>
                Sign Up
              </Button>
            </HStack>
          </HStack>

          <Stack
            id="mobile-navigation"
            display={{ base: isMenuOpen ? "flex" : "none", md: "none" }}
            gap="3"
            pt="1"
          >
            <Stack gap="2">
              {navItems.map((item) => {
                const active = currentPage === item.page;

                return (
                  <Button
                    key={item.page}
                    variant={active ? "solid" : "ghost"}
                    colorPalette={active ? "blue" : undefined}
                    rounded="xl"
                    justifyContent="flex-start"
                    w="full"
                    onClick={() => handleNavigate(item.page)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Stack gap="2" pt="1" borderTopWidth="1px" borderColor="gray.100">
              <Button
                variant="subtle"
                colorPalette="blue"
                rounded="xl"
                w="full"
                onClick={() => handleNavigate("login")}
              >
                Login
              </Button>
              <Button
                colorPalette="blue"
                rounded="xl"
                w="full"
                onClick={() => handleNavigate("signup")}
              >
                Sign Up
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
