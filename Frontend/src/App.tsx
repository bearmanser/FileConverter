import { Box, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ConvertUpload } from "./Components/ConvertUpload";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { API_BASE_URL, CONVERSION_MAP, getExtension } from "./constants";
import { ApiDocsPage } from "./Pages/ApiDocsPage";
import { AuthPage } from "./Pages/AuthPage";
import { PricingPage } from "./Pages/PricingPage";
import { convertFile, fetchSupportedFormats } from "./lib/api";
import type { ConversionMap, Page } from "./types";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [conversionMap, setConversionMap] = useState<ConversionMap>(CONVERSION_MAP);

  useEffect(() => {
    let isMounted = true;

    const loadFormats = async () => {
      try {
        const nextMap = await fetchSupportedFormats();
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
    const sourceFormat = getExtension(file.name);
    const allowedTargets = conversionMap[sourceFormat] ?? [];

    if (!allowedTargets.includes(toFormat)) {
      return {
        success: false,
        message: `Conversion from ${
          sourceFormat || "unknown"
        } to ${toFormat} is not available for this file type.`,
      };
    }

    try {
      const result = await convertFile(file, toFormat);

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The conversion service could not be reached.";

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
            <ConvertUpload conversionMap={conversionMap} onConvert={handleConvert} />
          )}
          {page === "api-docs" && (
            <ApiDocsPage apiBaseUrl={API_BASE_URL} conversionMap={conversionMap} />
          )}
          {page === "pricing" && (
            <PricingPage
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
