import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";

const exampleRequest = `curl -X POST "https://api.grinderstudio.no/file-convert" \\
  -H "Authorization: Bearer API_KEY" \\
  -H "Content-type: application/json" \\
  -d '
{
  "sourceFormat": "pdf",
  "targetFormat": "docx",
  "fileUrl": "https://example.com/files/source.pdf"
}
'`;

const exampleResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "jobId": "conv_123456",
    "status": "queued",
    "downloadUrl": "https://api.grinderstudio.no/file-convert/conv_123456"
  }
}`;

export function ApiDocsPage() {
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
            Upload files, request conversions, and fetch results through a
            simple API.
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
              API Endpoint
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
              https://api.grinderstudio.no/file-convert
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
              Fast uploads
            </Text>
            <Text mt="2" fontSize="sm" color="blue.700">
              Multipart upload support with predictable request structure.
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
              Multiple formats
            </Text>
            <Text mt="2" fontSize="sm" color="purple.700">
              Convert documents, images, spreadsheets, and media formats.
            </Text>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}
