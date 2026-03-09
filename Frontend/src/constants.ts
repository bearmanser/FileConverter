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
  mp4: ["mov", "avi", "mkv", "webm", "mp3", "wav", "aac", "ogg", "flac", "m4a"],
  mov: ["mp4", "avi", "mkv", "webm", "mp3", "wav", "aac", "ogg", "flac", "m4a"],
  avi: ["mp4", "mov", "mkv", "webm", "mp3", "wav", "aac", "ogg", "flac", "m4a"],
  mkv: ["mp4", "mov", "avi", "webm", "mp3", "wav", "aac", "ogg", "flac", "m4a"],
  webm: ["mp4", "mov", "avi", "mkv", "mp3", "wav", "aac", "ogg", "flac", "m4a"],
  mp3: ["wav", "aac", "ogg", "flac", "m4a"],
  wav: ["mp3", "aac", "ogg", "flac", "m4a"],
  aac: ["mp3", "wav", "ogg", "flac", "m4a"],
  ogg: ["mp3", "wav", "aac", "flac", "m4a"],
  flac: ["mp3", "wav", "aac", "ogg", "m4a"],
  m4a: ["mp3", "wav", "aac", "ogg", "flac"],
};

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: "starter",
    name: "Starter",
    price: "Free",
    description: "A clean entry point for individuals and lightweight workflows.",
    requestLimit: null,
    features: [
      "Unlimited conversions",
      "Documents, images, spreadsheets, audio, and video support",
      "Instant browser downloads",
      "Clean, focused workspace",
    ],
    cta: "Get Started",
  },
  pro: {
    key: "pro",
    name: "Pro",
    price: "$19",
    description: "Built for teams that need speed, polish, and dependable output.",
    requestLimit: null,
    features: [
      "Unlimited conversions",
      "Priority processing",
      "Advanced media and document workflows",
      "Team-ready collaboration experience",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  business: {
    key: "business",
    name: "Business",
    price: "$99",
    description: "For organizations that want scale, governance, and white-glove support.",
    requestLimit: null,
    features: [
      "Unlimited conversions",
      "Dedicated onboarding",
      "Enterprise-grade support",
      "Custom workflow guidance",
    ],
    cta: "Talk to Sales",
  },
};

export function getExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() ?? "" : "";
}
