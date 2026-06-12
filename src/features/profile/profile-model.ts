import { buildSocialUrl, formatSocialValue } from "../../socialLinks";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Language, SocialProvider, UserProfile } from "../../types";
import { buildProfileSubtitle } from "../../commands/profile-commands";

export const avatarOptions = [
  "https://i.pravatar.cc/160?img=68",
  "https://i.pravatar.cc/160?img=33",
  "https://i.pravatar.cc/160?img=16",
  "https://i.pravatar.cc/160?img=45",
  "https://i.pravatar.cc/160?img=53",
  "https://i.pravatar.cc/160?img=12",
];

export function deriveInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getProfileSubtitle(
  profile: UserProfile,
  language: Language,
  copy: AppCopy,
) {
  return buildProfileSubtitle(profile, language, copy.common.at);
}

export function buildEditableSocialValue(provider: SocialProvider, value: string) {
  if (provider === "email" || provider === "whatsapp") {
    return formatSocialValue(provider, value);
  }

  return buildSocialUrl(provider, value) ?? formatSocialValue(provider, value);
}

export function getResolvedProfileField(
  value: UserProfile["role"] | UserProfile["headline"],
  language: Language,
) {
  return resolveLocalizedText(value, language);
}
