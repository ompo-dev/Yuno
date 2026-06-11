import { Ionicons } from "@expo/vector-icons";

import { SocialProvider } from "./types";

interface SocialProviderConfig {
  backgroundColor: string;
  borderColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  textColor: string;
}

export const socialProviderOrder: SocialProvider[] = [
  "linkedin",
  "instagram",
  "whatsapp",
  "x",
  "telegram",
  "email",
];

export const socialProviderConfig: Record<SocialProvider, SocialProviderConfig> = {
  linkedin: {
    backgroundColor: "#EAF2FF",
    borderColor: "#D5E5FF",
    icon: "logo-linkedin",
    iconColor: "#0A66C2",
    label: "LinkedIn",
    textColor: "#0A66C2",
  },
  instagram: {
    backgroundColor: "#FFF0F7",
    borderColor: "#FFD7E9",
    icon: "logo-instagram",
    iconColor: "#E1306C",
    label: "Instagram",
    textColor: "#C23369",
  },
  whatsapp: {
    backgroundColor: "#EAF8EF",
    borderColor: "#D2EEDC",
    icon: "logo-whatsapp",
    iconColor: "#25D366",
    label: "WhatsApp",
    textColor: "#1F9E4B",
  },
  x: {
    backgroundColor: "#EEF1F4",
    borderColor: "#D8DEE4",
    icon: "logo-twitter",
    iconColor: "#111111",
    label: "X",
    textColor: "#111111",
  },
  telegram: {
    backgroundColor: "#EEF7FF",
    borderColor: "#D8EAFF",
    icon: "paper-plane-outline",
    iconColor: "#229ED9",
    label: "Telegram",
    textColor: "#229ED9",
  },
  email: {
    backgroundColor: "#FFF5EA",
    borderColor: "#FFE2BF",
    icon: "mail-outline",
    iconColor: "#B4690E",
    label: "Email",
    textColor: "#B4690E",
  },
};

export function normalizeSocialValue(provider: SocialProvider, value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  switch (provider) {
    case "linkedin":
      return trimmed
        .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
        .replace(/^@/, "")
        .replace(/\/+$/, "");
    case "instagram":
      return trimmed
        .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
        .replace(/^@/, "")
        .replace(/\/+$/, "");
    case "whatsapp":
      return trimmed.replace(/[^\d+]/g, "");
    case "x":
      return trimmed
        .replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "")
        .replace(/^@/, "")
        .replace(/\/+$/, "");
    case "telegram":
      return trimmed
        .replace(/^https?:\/\/(www\.)?t\.me\//i, "")
        .replace(/^@/, "")
        .replace(/\/+$/, "");
    case "email":
      return trimmed.toLowerCase();
    default:
      return trimmed;
  }
}

export function formatSocialValue(provider: SocialProvider, value: string) {
  const normalized = normalizeSocialValue(provider, value);

  if (!normalized) {
    return "";
  }

  switch (provider) {
    case "linkedin":
      return `in/${normalized}`;
    case "instagram":
    case "x":
    case "telegram":
      return normalized.startsWith("@") ? normalized : `@${normalized}`;
    case "whatsapp":
      return normalized.startsWith("+") ? normalized : `+${normalized}`;
    case "email":
      return normalized;
    default:
      return normalized;
  }
}

export function buildSocialUrl(provider: SocialProvider, value: string) {
  const normalized = normalizeSocialValue(provider, value);

  if (!normalized) {
    return null;
  }

  switch (provider) {
    case "linkedin":
      return `https://www.linkedin.com/in/${normalized}`;
    case "instagram":
      return `https://instagram.com/${normalized}`;
    case "whatsapp":
      return `https://wa.me/${normalized.replace(/[^\d]/g, "")}`;
    case "x":
      return `https://x.com/${normalized}`;
    case "telegram":
      return `https://t.me/${normalized}`;
    case "email":
      return `mailto:${normalized}`;
    default:
      return null;
  }
}

export function detectSocialProvider(value: string) {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.includes("linkedin.com/in/") ||
    trimmed.startsWith("in/")
  ) {
    return "linkedin" as const;
  }

  if (trimmed.includes("instagram.com/")) {
    return "instagram" as const;
  }

  if (
    trimmed.includes("x.com/") ||
    trimmed.includes("twitter.com/")
  ) {
    return "x" as const;
  }

  if (
    trimmed.includes("t.me/") ||
    trimmed.includes("telegram.me/")
  ) {
    return "telegram" as const;
  }

  if (
    trimmed.includes("wa.me/") ||
    trimmed.includes("whatsapp.com/") ||
    /^\+?\d[\d\s()-]{7,}$/.test(trimmed)
  ) {
    return "whatsapp" as const;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "email" as const;
  }

  return null;
}
