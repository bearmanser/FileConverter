import {
  Box,
  Button,
  FileUpload,
  HStack,
  NativeSelect,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import type { AlertState, ConversionMap } from "../types";
import { StatusAlert } from "./StatusAlert";

type ConvertUploadProps = {
  conversionMap: ConversionMap;
  onConvert: (
    file: File,
    toFormat: string
  ) => Promise<{ success: boolean; message: string }>;
};

export function ConvertUpload({
  conversionMap,
  onConvert,
}: ConvertUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const sourceFormat = file ? file.name.toLowerCase().split(".").pop() ?? "" : "";

  const availableFormats = useMemo(() => {
    if (!sourceFormat) {
      return [];
    }

    return conversionMap[sourceFormat] ?? [];
  }, [conversionMap, sourceFormat]);

  const handleFileChange = (details: { acceptedFiles: File[] }) => {
    const nextFile = details.acceptedFiles[0] ?? null;
    setFile(nextFile);
    setTargetFormat("");
    setAlert(null);
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) {
      return;
    }

    setAlert(null);
    setIsConverting(true);

    try {
      const result = await onConvert(file, targetFormat);
      setAlert({
        status: result.success ? "success" : "error",
        title: result.success ? "Conversion successful" : "Conversion failed",
        description: result.message,
      });
    } finally {
      setIsConverting(false);
    }
  };

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
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="gray.900"
          >
            Convert files in seconds
          </Text>
          <Text fontSize="md" color="gray.600" maxW="2xl">
            Upload a document, image, spreadsheet, video, or audio file, choose
            an output format, and download the converted result instantly.
          </Text>
        </Stack>

        <StatusAlert alert={alert} />

        <Box
          bg="blue.50"
          borderWidth="1px"
          borderColor="blue.100"
          rounded="xl"
          p="5"
        >
          <Stack gap="4">
            <Text fontSize="sm" fontWeight="semibold" color="blue.700">
              Upload file
            </Text>

            <FileUpload.Root maxFiles={1} onFileChange={handleFileChange}>
              <FileUpload.HiddenInput />
              <HStack
                justify="space-between"
                align="center"
                gap="4"
                flexWrap="wrap"
              >
                <FileUpload.Trigger asChild>
                  <Button colorPalette="blue" size="lg" rounded="xl">
                    Choose file
                  </Button>
                </FileUpload.Trigger>

                <Box
                  flex="1"
                  minW={{ base: "full", sm: "260px" }}
                  bg="white"
                  borderWidth="1px"
                  borderColor="blue.100"
                  rounded="xl"
                  px="4"
                  py="3"
                >
                  <Text
                    fontSize="sm"
                    color={file ? "gray.800" : "gray.500"}
                    truncate
                  >
                    {file ? file.name : "No file selected"}
                  </Text>
                </Box>
              </HStack>
            </FileUpload.Root>
          </Stack>
        </Box>

        <Separator />

        <Stack gap="4">
          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
            Conversion settings
          </Text>

          <Box
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="xl"
            p="5"
          >
            <Stack gap="4">
              <HStack
                justify="space-between"
                align={{ base: "start", md: "center" }}
                flexDirection={{ base: "column", md: "row" }}
                gap="3"
              >
                <Text fontSize="sm" color="gray.600">
                  Source format
                </Text>
                <Box
                  px="3"
                  py="1.5"
                  rounded="full"
                  bg={file ? "purple.50" : "gray.100"}
                  color={file ? "purple.700" : "gray.500"}
                  fontSize="sm"
                  fontWeight="semibold"
                  borderWidth="1px"
                  borderColor={file ? "purple.100" : "gray.200"}
                >
                  {sourceFormat || "No file uploaded"}
                </Box>
              </HStack>

              {!file ? (
                <Box
                  bg="white"
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="gray.300"
                  rounded="xl"
                  p="4"
                >
                  <Stack gap="2">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      No file uploaded
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Add a file above to unlock available output formats and
                      start a conversion.
                    </Text>
                  </Stack>
                </Box>
              ) : availableFormats.length > 0 ? (
                <Stack gap="4">
                  <Text fontSize="sm" color="gray.700">
                    Convert to
                  </Text>

                  <NativeSelect.Root size="lg">
                    <NativeSelect.Field
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      bg="white"
                      borderColor="gray.300"
                      rounded="xl"
                    >
                      <option value="" disabled>
                        Select output format
                      </option>
                      {availableFormats.map((format) => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>

                  <Button
                    onClick={handleConvert}
                    loading={isConverting}
                    colorPalette="blue"
                    size="lg"
                    rounded="xl"
                    alignSelf={{ base: "stretch", sm: "start" }}
                    minW={{ sm: "180px" }}
                    disabled={!targetFormat}
                  >
                    Convert
                  </Button>
                </Stack>
              ) : (
                <Box
                  bg="orange.50"
                  borderWidth="1px"
                  borderColor="orange.200"
                  rounded="xl"
                  p="4"
                >
                  <Text fontSize="sm" color="orange.700">
                    No conversion formats are available for this file type.
                  </Text>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
