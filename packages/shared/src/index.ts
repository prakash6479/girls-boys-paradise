export const BRAND = {
  name: "୨ৎ・GIRLS & BOYS PARADISE 🌸",
  tagline: "CHAT • GAMING • VOICE • MUSIC • EVENTS",
} as const;

export type ApiHealth = {
  status: "ok" | "degraded";
  service: "gbp-api";
  timestamp: string;
  database: "connected" | "not_configured" | "error";
};

export type ApiError = { error: { code: string; message: string } };
