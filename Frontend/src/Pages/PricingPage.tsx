import { Badge, Box, Button, HStack, Stack, Text } from "@chakra-ui/react";

import { PLANS } from "../constants";
import type { PlanKey } from "../types";

type PricingPageProps = {
  onChoosePlan: (plan: PlanKey) => void;
};

export function PricingPage({ onChoosePlan }: PricingPageProps) {
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
            Choose the experience that best fits your workflow and team.
          </Text>
        </Stack>

        <HStack align="stretch" gap="6" flexWrap="wrap">
          {pricingPlans.map((plan) => {
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
                    variant={plan.highlighted ? "solid" : "subtle"}
                    rounded="xl"
                    onClick={() => onChoosePlan(plan.key)}
                  >
                    {plan.cta}
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
