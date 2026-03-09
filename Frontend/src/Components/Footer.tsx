import { Box, Container, HStack, Stack, Text } from "@chakra-ui/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.50" borderTopWidth="1px" borderColor="gray.200">
      <Container maxW="7xl" py={{ base: "6", md: "8" }}>
        <HStack justify="space-between" gap="4" flexWrap="wrap">
          <Stack gap="1">
            <Text fontSize="sm" color="gray.600">
              Fast, simple file conversion for teams and apps.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Copyright {year} FileConvert. All rights reserved.
            </Text>
          </Stack>

          <Stack gap="1" textAlign={{ base: "left", md: "right" }}>
            <Text fontSize="sm" color="gray.500">
              Built for quick uploads, reliable conversions, and clear API docs.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Designed and developed by Grinder Studio.
            </Text>
          </Stack>
        </HStack>
      </Container>
    </Box>
  );
}
