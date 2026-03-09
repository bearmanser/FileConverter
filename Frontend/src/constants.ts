import { createSystem, defaultConfig } from "@chakra-ui/react";

import type { ConversionMap, Plan, PlanKey } from "./types";

export const system = createSystem(defaultConfig);

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export const CONVERSION_MAP: ConversionMap = {
  pdf: ["docx", "txt", "html"],
  docx: ["pdf", "txt", "html"],
  txt: ["pdf", "docx", "md", "html"],
  md: ["pdf", "docx", "html", "txt"],
  html: ["pdf", "txt", "md", "docx"],
  jpg: ["png", "webp", "pdf"],
  jpeg: ["png", "webp", "pdf"],
  png: ["jpg", "webp", "pdf"],
  webp: ["png", "jpg", "pdf"],
  csv: ["xlsx", "json", "txt", "pdf"],
  json: ["csv", "txt", "xlsx", "pdf"],
  xlsx: ["csv", "json", "txt", "pdf"],
};

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: "starter",
    name: "Starter",
    price: "Free",
    description: "Good for testing and lightweight personal use.",
    requestLimit: 10,
    features: [
      "10 conversion requests per month",
      "Documents, images, and spreadsheet conversions",
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
      "Priority processing for local API requests",
      "More complex document and data transforms",
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

export function getExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() ?? "" : "";
}
