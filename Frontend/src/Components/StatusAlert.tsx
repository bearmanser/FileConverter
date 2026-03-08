import { Alert } from "@chakra-ui/react";

import type { AlertState } from "../types";

type StatusAlertProps = {
  alert: AlertState;
};

export function StatusAlert({ alert }: StatusAlertProps) {
  if (!alert) {
    return null;
  }

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
