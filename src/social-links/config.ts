import { Ionicons } from "@expo/vector-icons";

import { SocialProvider } from "../types";

export interface SocialProviderConfig {
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
