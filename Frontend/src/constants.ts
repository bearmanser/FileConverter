import { createSystem, defaultConfig } from "@chakra-ui/react";

import type { Plan, PlanKey } from "./types";

export const system = createSystem(defaultConfig);

export const CONVERSION_MAP: Record<string, string[]> = {
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

export const PLANS: Record<PlanKey, Plan> = {
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

export function getExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() ?? "" : "";
}
