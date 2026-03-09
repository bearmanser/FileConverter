import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";

import type { ConversionMap } from "../types";

type ApiDocsPageProps = {
  apiBaseUrl: string;
  conversionMap: ConversionMap;
};

function formatPairs(conversionMap: ConversionMap) {
  return Object.entries(conversionMap)
    .map(([source, targets]) => `${source.toUpperCase()} -> ${targets.map((target) => target.toUpperCase()).join(", ")}`)
    .join("\n");
}

export function ApiDocsPage({ apiBaseUrl, conversionMap }: ApiDocsPageProps) {
  const exampleRequest = `curl -X POST "${apiBaseUrl}/api/convert" \\
  -F "file=@sample.mp4" \\
  -F "target_format=mp3" \\
  --output sample.mp3`;

  const exampleResponse = `HTTP/1.1 200 OK
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="sample.mp3"`;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="2xl"
      p={{ base: "6", md: "8" }}
      w="full"
    >
      <Stack gap="6">
        <Stack gap="2">
          <Badge
            colorPalette="blue"
            alignSelf="start"
            px="3"
            py="1"
            rounded="full"
          >
            API Docs
          </Badge>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="gray.900"
          >
            Integrate file conversion into your app
          </Text>
          <Text color="gray.600" maxW="2xl">
            Upload documents, images, spreadsheets, videos, or audio with
            multipart form data, request a target format, and receive the
            converted file directly from the conversion API.
          </Text>
        </Stack>

        <Box
          bg="gray.50"
          rounded="xl"
          borderWidth="1px"
          borderColor="gray.200"
          p="5"
        >
          <Stack gap="3">
            <Text fontWeight="semibold" color="gray.800">
              API Base URL
            </Text>
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              p="4"
              fontFamily="mono"
              fontSize="sm"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {apiBaseUrl}
            </Box>

            <Text fontWeight="semibold" color="gray.800">
              Example Request
            </Text>
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              p="4"
              fontFamily="mono"
              fontSize="sm"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {exampleRequest}
            </Box>

            <Text fontWeight="semibold" color="gray.800">
              Example Response
            </Text>
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              p="4"
              fontFamily="mono"
              fontSize="sm"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {exampleResponse}
            </Box>

            <Text fontWeight="semibold" color="gray.800">
              Supported Conversions
            </Text>
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              p="4"
              fontFamily="mono"
              fontSize="sm"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {formatPairs(conversionMap)}
            </Box>
          </Stack>
        </Box>

        <HStack gap="4" flexWrap="wrap">
          <Box
            flex="1"
            minW="220px"
            bg="blue.50"
            borderWidth="1px"
            borderColor="blue.100"
            rounded="xl"
            p="5"
          >
            <Text fontWeight="semibold" color="blue.800">
              Multipart uploads
            </Text>
            <Text mt="2" fontSize="sm" color="blue.700">
              Send the source file and a `target_format` field in the same
              request.
            </Text>
          </Box>
          <Box
            flex="1"
            minW="220px"
            bg="purple.50"
            borderWidth="1px"
            borderColor="purple.100"
            rounded="xl"
            p="5"
          >
            <Text fontWeight="semibold" color="purple.800">
              Direct downloads
            </Text>
            <Text mt="2" fontSize="sm" color="purple.700">
              The API responds with the converted file immediately, ready for a
              browser download or automation workflow.
            </Text>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}
