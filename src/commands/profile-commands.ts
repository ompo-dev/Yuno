import { normalizeSocialValue } from "../socialLinks";
import {
  Language,
  LocalizedText,
  SocialProvider,
  UserProfile,
} from "../types";

function localizedValue(value: string): LocalizedText {
  return {
    en: value,
    "pt-BR": value,
  };
}

function areRecordsEqual(
  current: Partial<Record<SocialProvider, string>>,
  next: Partial<Record<SocialProvider, string>>,
) {
  const currentEntries = Object.entries(current);
  const nextEntries = Object.entries(next);

  if (currentEntries.length !== nextEntries.length) {
    return false;
  }

  return currentEntries.every(([key, value]) => next[key as SocialProvider] === value);
}

export function buildProfileSubtitle(
  profile: UserProfile,
  language: Language,
  atLabel: string,
) {
  const subtitle =
    typeof profile.role === "string" ? profile.role : profile.role[language] ?? "";
  const company = profile.company.trim();

  if (subtitle.trim() && company) {
    return `${subtitle.trim()} ${atLabel} ${company}`;
  }

  return subtitle.trim() || company;
}

export function createEditableProfileDraft(
  profile: UserProfile,
  language: Language,
  atLabel: string,
) {
  const nextRole = buildProfileSubtitle(profile, language, atLabel);

  if (!profile.company && nextRole === (typeof profile.role === "string"
    ? profile.role
    : profile.role[language] ?? "")) {
    return profile;
  }

  return {
    ...profile,
    company: "",
    role: localizedValue(nextRole),
  };
}

export function setProfileFullName(profile: UserProfile, fullName: string) {
  if (profile.fullName === fullName) {
    return profile;
  }

  return {
    ...profile,
    fullName,
  };
}

export function setLocalizedProfileField(
  profile: UserProfile,
  field: "role" | "headline",
  language: Language,
  value: string,
) {
  const currentValue = profile[field];
  const localized =
    typeof currentValue === "string" ? localizedValue(value) : { ...currentValue, [language]: value };
  const resolvedCurrent =
    typeof currentValue === "string" ? currentValue : currentValue[language] ?? "";

  if (resolvedCurrent === value) {
    return profile;
  }

  return {
    ...profile,
    [field]: localized,
  };
}

export function addProfileInterest(
  profile: UserProfile,
  label: string,
  language: Language,
) {
  const trimmed = label.trim();

  if (!trimmed) {
    return profile;
  }

  const alreadyExists = profile.interests.some((interest) => {
    const resolved = typeof interest === "string" ? interest : interest[language] ?? "";
    return resolved.trim().toLowerCase() === trimmed.toLowerCase();
  });

  if (alreadyExists) {
    return profile;
  }

  return {
    ...profile,
    interests: [...profile.interests, localizedValue(trimmed)],
  };
}

export function removeProfileInterest(
  profile: UserProfile,
  label: string,
  language: Language,
) {
  const nextInterests = profile.interests.filter((interest) => {
    const resolved = typeof interest === "string" ? interest : interest[language] ?? "";
    return resolved !== label;
  });

  if (nextInterests.length === profile.interests.length) {
    return profile;
  }

  return {
    ...profile,
    interests: nextInterests,
  };
}

export function upsertProfileSocial(
  profile: UserProfile,
  provider: SocialProvider,
  value: string,
  initialProvider?: SocialProvider | null,
) {
  const normalized = normalizeSocialValue(provider, value);

  if (!normalized) {
    return profile;
  }

  const nextSocials = {
    ...profile.socials,
  };

  if (initialProvider && initialProvider !== provider) {
    delete nextSocials[initialProvider];
  }

  nextSocials[provider] = normalized;

  if (areRecordsEqual(profile.socials, nextSocials)) {
    return profile;
  }

  return {
    ...profile,
    socials: nextSocials,
  };
}

export function removeProfileSocial(
  profile: UserProfile,
  provider: SocialProvider,
) {
  if (!profile.socials[provider]) {
    return profile;
  }

  const nextSocials = {
    ...profile.socials,
  };
  delete nextSocials[provider];

  return {
    ...profile,
    socials: nextSocials,
  };
}

export function setProfileAvatar(profile: UserProfile, avatarUrl: string) {
  if (profile.avatarUrl === avatarUrl) {
    return profile;
  }

  return {
    ...profile,
    avatarUrl,
  };
}

export function finalizeProfileDraft(profile: UserProfile) {
  const firstName = profile.fullName.trim().split(/\s+/)[0] ?? profile.fullName;
  const nextFirstName = localizedValue(firstName);
  const currentFirstName =
    typeof profile.firstName === "string" ? profile.firstName : profile.firstName.en;

  if (currentFirstName === firstName) {
    return profile;
  }

  return {
    ...profile,
    firstName: nextFirstName,
  };
}
