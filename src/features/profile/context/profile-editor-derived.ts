import { buildProfileSubtitle } from "../../../commands/profile-commands";
import { AppCopy } from "../../../i18n";
import {
  detectSocialProvider,
  normalizeSocialValue,
  socialProviderOrder,
} from "../../../socialLinks";
import { Language, SocialLink, UserProfile } from "../../../types";
import { deriveInitials } from "../profile-model";
import { LinkDialogState, ProfileEditorDerivedState } from "./types";

interface BuildProfileEditorDerivedParams {
  avatarDialogVisible: boolean;
  copy: AppCopy;
  currentProfile: UserProfile;
  interestDialogVisible: boolean;
  language: Language;
  linkDialog: LinkDialogState | null;
}

function buildSocialLinks(profile: UserProfile): SocialLink[] {
  return socialProviderOrder
    .map((provider) => ({
      provider,
      value: profile.socials[provider] ?? "",
    }))
    .filter((item): item is SocialLink => Boolean(item.value));
}

export function buildProfileEditorDerived({
  avatarDialogVisible,
  copy,
  currentProfile,
  interestDialogVisible,
  language,
  linkDialog,
}: BuildProfileEditorDerivedParams): ProfileEditorDerivedState {
  const currentInitials = deriveInitials(currentProfile.fullName);
  const currentSubtitle = buildProfileSubtitle(currentProfile, language, copy.common.at);
  const socialLinks = buildSocialLinks(currentProfile);
  const linkDialogProvider = linkDialog
    ? detectSocialProvider(linkDialog.value) ?? linkDialog.initialProvider
    : null;
  const normalizedDialogLink =
    linkDialog && linkDialogProvider
      ? normalizeSocialValue(linkDialogProvider, linkDialog.value)
      : "";

  return {
    currentInitials,
    currentProfile,
    currentSubtitle,
    isAvatarDialogVisible: avatarDialogVisible,
    isInterestDialogVisible: interestDialogVisible,
    isLinkDialogVisible: Boolean(linkDialog),
    linkDialogProvider,
    normalizedDialogLink,
    socialLinks,
  };
}
