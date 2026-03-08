import {
  Alert,
  Badge,
  Box,
  Button,
  ChakraProvider,
  Container,
  FileUpload,
  HStack,
  NativeSelect,
  Separator,
  Stack,
  Text,
  createSystem,
  defaultConfig,
} from "@chakra-ui/react";
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type ConvertUploadProps = {
  plan: PlanKey;
  usage: number;
  onConvert: (
    file: File,
    toFormat: string
  ) => Promise<{ success: boolean; message: string }>;
};

type Page = "home" | "api-docs" | "pricing" | "login" | "signup";
type PlanKey = "starter" | "pro" | "business";

type Plan = {
  key: PlanKey;
  name: string;
  price: string;
  description: string;
  requestLimit: number | null;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

type AlertState = {
  status: "success" | "error";
  title: string;
  description: string;
} | null;

const system = createSystem(defaultConfig);

const CONVERSION_MAP: Record<string, string[]> = {
  pdf: ["docx", "txt", "html"],
  docx: ["pdf", "txt", "html"],
  txt: ["pdf", "docx", "md", "html"],
  md: ["pdf", "docx", "html", "txt"],
  html: ["pdf", "txt", "md"],
  jpg: ["png", "webp", "pdf"],
  jpeg: ["png", "webp", "pdf"],
  png: ["jpg", "webp", "pdf"],
  webp: ["png", "jpg", "pdf"],
  csv: ["xlsx", "json", "txt"],
  json: ["csv", "txt"],
  xlsx: ["csv", "pdf"],
  mp3: ["wav", "ogg"],
  wav: ["mp3", "ogg"],
  mp4: ["mov", "webm", "mp3"],
  mov: ["mp4", "webm", "mp3"],
  webm: ["mp4", "mp3"],
};

const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: "starter",
    name: "Starter",
    price: "Free",
    description: "Good for testing and lightweight personal use.",
    requestLimit: 10,
    features: [
      "10 conversion requests per month",
      "Basic document and image formats",
      "Manual conversions in dashboard",
      "Community support",
    ],
    cta: "Choose Starter",
  },
  pro: {
    key: "pro",
    name: "Pro",
    price: "$19",
    description: "Built for teams and apps with recurring conversion needs.",
    requestLimit: 250,
    features: [
      "250 conversion requests per month",
      "Documents, images, spreadsheets, and media",
      "Priority processing",
      "Email support",
    ],
    cta: "Choose Pro",
    highlighted: true,
  },
  business: {
    key: "business",
    name: "Business",
    price: "$99",
    description: "For production workloads that need scale and no hard cap.",
    requestLimit: null,
    features: [
      "Unlimited conversion requests",
      "Fastest processing tier",
      "Priority API access",
      "Dedicated support",
    ],
    cta: "Choose Business",
  },
};

function getExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() ?? "" : "";
}

function Header({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}) {
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

function StatusAlert({ alert }: { alert: AlertState }) {
  if (!alert) return null;

  return (
    <Alert.Root
      status={alert.status}
      borderRadius="xl"
      borderWidth="1px"
      alignItems="start"
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{alert.title}</Alert.Title>
        <Alert.Description>{alert.description}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

function ConvertUpload({ onConvert, plan, usage }: ConvertUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const sourceFormat = file ? getExtension(file.name) : "";
  const selectedPlan = PLANS[plan];
  const requestLimit = selectedPlan.requestLimit;
  const requestsRemaining =
    requestLimit === null ? null : Math.max(requestLimit - usage, 0);

  const availableFormats = useMemo(() => {
    if (!sourceFormat) return [];
    return CONVERSION_MAP[sourceFormat] ?? [];
  }, [sourceFormat]);

  const handleFileChange = (details: { acceptedFiles: File[] }) => {
    const nextFile = details.acceptedFiles[0] ?? null;
    setFile(nextFile);
    setTargetFormat("");
    setAlert(null);
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

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
            Upload your file, choose an available output format, and start the
            conversion.
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
                  <Button
                    colorPalette="blue"
                    size="lg"
                    rounded="xl"
                    disabled={requestsRemaining === 0}
                  >
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

        {file && (
          <>
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
                      bg="purple.50"
                      color="purple.700"
                      fontSize="sm"
                      fontWeight="semibold"
                      borderWidth="1px"
                      borderColor="purple.100"
                    >
                      {sourceFormat || "unknown"}
                    </Box>
                  </HStack>

                  {availableFormats.length > 0 ? (
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
                        disabled={!targetFormat || requestsRemaining === 0}
                      >
                        Convert
                      </Button>

                      {requestsRemaining === 0 && (
                        <Alert.Root
                          status="error"
                          borderRadius="xl"
                          borderWidth="1px"
                        >
                          <Alert.Indicator />
                          <Alert.Content>
                            <Alert.Title>Request limit reached</Alert.Title>
                            <Alert.Description>
                              Your {selectedPlan.name} plan has no requests
                              remaining. Upgrade your plan to continue
                              converting files.
                            </Alert.Description>
                          </Alert.Content>
                        </Alert.Root>
                      )}
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
          </>
        )}
      </Stack>
    </Box>
  );
}

function ApiDocsPage() {
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
              POST /v1/convert
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
              {`{
  "sourceFormat": "pdf",
  "targetFormat": "docx"
}`}
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

function PricingPage({
  currentPlan,
  onChoosePlan,
}: {
  currentPlan: PlanKey;
  onChoosePlan: (plan: PlanKey) => void;
}) {
  const pricingPlans = Object.values(PLANS);

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
        <Stack gap="2" textAlign="center">
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="gray.900"
          >
            Simple pricing
          </Text>
          <Text color="gray.600">
            Choose a request volume that fits your product and workflow.
          </Text>
        </Stack>

        <HStack align="stretch" gap="6" flexWrap="wrap">
          {pricingPlans.map((plan) => {
            const isCurrent = currentPlan === plan.key;

            return (
              <Box
                key={plan.key}
                flex="1"
                minW="260px"
                borderWidth="1px"
                borderColor={plan.highlighted ? "blue.200" : "gray.200"}
                rounded="2xl"
                p="6"
                bg={plan.highlighted ? "blue.50" : "gray.50"}
                display="flex"
              >
                <Stack gap="5" flex="1" h="full">
                  <Stack gap="2">
                    {plan.highlighted && (
                      <Badge
                        colorPalette="blue"
                        alignSelf="start"
                        px="3"
                        py="1"
                        rounded="full"
                      >
                        Most Popular
                      </Badge>
                    )}
                    <Text fontSize="xl" fontWeight="bold" color="gray.900">
                      {plan.name}
                    </Text>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      color={plan.highlighted ? "blue.700" : "gray.900"}
                    >
                      {plan.price}
                      {plan.price !== "Free" && (
                        <Text
                          as="span"
                          fontSize="md"
                          fontWeight="medium"
                          color="gray.500"
                        >
                          /mo
                        </Text>
                      )}
                    </Text>
                    <Text color={plan.highlighted ? "blue.800" : "gray.600"}>
                      {plan.description}
                    </Text>
                  </Stack>

                  <Stack gap="3">
                    {plan.features.map((feature) => (
                      <HStack key={feature} align="start" gap="3">
                        <Box
                          mt="1.5"
                          w="2"
                          h="2"
                          rounded="full"
                          bg={plan.highlighted ? "blue.500" : "purple.500"}
                          flexShrink="0"
                        />
                        <Text fontSize="sm" color="gray.700">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>

                  <Button
                    mt="auto"
                    colorPalette="blue"
                    variant={isCurrent ? "subtle" : "solid"}
                    rounded="xl"
                    onClick={() => onChoosePlan(plan.key)}
                  >
                    {isCurrent ? `Current Plan: ${plan.name}` : plan.cta}
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </HStack>
      </Stack>
    </Box>
  );
}

function AuthPage({
  mode,
  onNavigate,
}: {
  mode: "login" | "signup";
  onNavigate: (page: Page) => void;
}) {
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

function App() {
  const [page, setPage] = useState<Page>("home");
  const [plan, setPlan] = useState<PlanKey>("starter");
  const [usage, setUsage] = useState(0);

  const handleConvert = async (file: File, toFormat: string) => {
    const selectedPlan = PLANS[plan];
    const limit = selectedPlan.requestLimit;

    if (limit !== null && usage >= limit) {
      return {
        success: false,
        message: `You have reached the ${selectedPlan.name} request limit of ${limit} conversions this month.`,
      };
    }

    const sourceFormat = getExtension(file.name);
    const allowedTargets = CONVERSION_MAP[sourceFormat] ?? [];

    if (!allowedTargets.includes(toFormat)) {
      return {
        success: false,
        message: `Conversion from ${
          sourceFormat || "unknown"
        } to ${toFormat} is not supported.`,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    const shouldFail = file.name.toLowerCase().includes("fail");

    if (shouldFail) {
      return {
        success: false,
        message: `We could not convert ${file.name}. Try a different file and try again.`,
      };
    }

    setUsage((current) => current + 1);

    return {
      success: true,
      message: `${
        file.name
      } was converted to ${toFormat.toUpperCase()}. 1 request was used from your ${
        selectedPlan.name
      } plan.`,
    };
  };

  return (
    <Box minH="100vh" bg="white">
      <Header currentPage={page} onNavigate={setPage} />

      <Container
        maxW="5xl"
        py={{ base: "10", md: "16" }}
        display="flex"
        justifyContent="center"
      >
        <Box
          w="full"
          maxW={page === "login" || page === "signup" ? "xl" : "5xl"}
        >
          {page === "home" && (
            <ConvertUpload
              plan={plan}
              usage={usage}
              onConvert={handleConvert}
            />
          )}

          {page === "api-docs" && <ApiDocsPage />}
          {page === "pricing" && (
            <PricingPage
              currentPlan={plan}
              onChoosePlan={(nextPlan) => {
                setPlan(nextPlan);
                setPage("home");
              }}
            />
          )}
          {page === "login" && <AuthPage mode="login" onNavigate={setPage} />}
          {page === "signup" && <AuthPage mode="signup" onNavigate={setPage} />}
        </Box>
      </Container>
    </Box>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
