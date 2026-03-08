export type Page = "home" | "api-docs" | "pricing" | "login" | "signup";

export type PlanKey = "starter" | "pro" | "business";

export type Plan = {
  key: PlanKey;
  name: string;
  price: string;
  description: string;
  requestLimit: number | null;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export type AlertState = {
  status: "success" | "error";
  title: string;
  description: string;
} | null;
