import { SocialProvider } from "../types";

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

  if (trimmed.includes("linkedin.com/in/") || trimmed.startsWith("in/")) {
    return "linkedin" as const;
  }

  if (trimmed.includes("instagram.com/")) {
    return "instagram" as const;
  }

  if (trimmed.includes("x.com/") || trimmed.includes("twitter.com/")) {
    return "x" as const;
  }

  if (trimmed.includes("t.me/") || trimmed.includes("telegram.me/")) {
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
