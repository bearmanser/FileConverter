import { Box, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ConvertUpload } from "./Components/ConvertUpload";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { API_BASE_URL, CONVERSION_MAP, PLANS, getExtension } from "./constants";
import { ApiDocsPage } from "./Pages/ApiDocsPage";
import { AuthPage } from "./Pages/AuthPage";
import { PricingPage } from "./Pages/PricingPage";
import { convertFileWithBackend, fetchConversionMap } from "./lib/api";
import type { ConversionMap, Page, PlanKey } from "./types";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [plan] = useState<PlanKey>("starter");
  const [usage, setUsage] = useState(0);
  const [conversionMap, setConversionMap] = useState<ConversionMap>(CONVERSION_MAP);

  useEffect(() => {
    let isMounted = true;

    const loadFormats = async () => {
      try {
        const nextMap = await fetchConversionMap();
        if (isMounted) {
          setConversionMap(nextMap);
        }
      } catch {
        if (isMounted) {
          setConversionMap(CONVERSION_MAP);
        }
      }
    };

    void loadFormats();

    return () => {
      isMounted = false;
    };
  }, []);

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
    const allowedTargets = conversionMap[sourceFormat] ?? [];

    if (!allowedTargets.includes(toFormat)) {
      return {
        success: false,
        message: `Conversion from ${
          sourceFormat || "unknown"
        } to ${toFormat} is not supported by the local backend.`,
      };
    }

    try {
      const result = await convertFileWithBackend(file, toFormat);
      setUsage((current) => current + 1);

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The frontend could not reach the local backend.";

      return {
        success: false,
        message,
      };
    }
  };

  return (
    <Box minH="100vh" bg="white" display="flex" flexDirection="column">
      <Header currentPage={page} onNavigate={setPage} />

      <Container
        as="main"
        maxW="5xl"
        flex="1"
        py={{ base: "10", md: "16" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH={{ base: "calc(100vh - 180px)", md: "calc(100vh - 208px)" }}
      >
        <Box
          w="full"
          maxW={page === "login" || page === "signup" ? "xl" : "5xl"}
        >
          {page === "home" && (
            <ConvertUpload
              conversionMap={conversionMap}
              plan={plan}
              usage={usage}
              onConvert={handleConvert}
            />
          )}
          {page === "api-docs" && (
            <ApiDocsPage apiBaseUrl={API_BASE_URL} conversionMap={conversionMap} />
          )}
          {page === "pricing" && (
            <PricingPage
              currentPlan={plan}
              onChoosePlan={() => {
                setPage("signup");
              }}
            />
          )}
          {page === "login" && <AuthPage mode="login" onNavigate={setPage} />}
          {page === "signup" && <AuthPage mode="signup" onNavigate={setPage} />}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

export default App;
