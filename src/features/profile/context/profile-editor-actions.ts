import { Dispatch, SetStateAction } from "react";

import {
  addProfileInterest,
  createEditableProfileDraft,
  finalizeProfileDraft,
  removeProfileInterest,
  removeProfileSocial,
  setLocalizedProfileField,
  setProfileAvatar,
  setProfileFullName,
  upsertProfileSocial,
} from "../../../commands/profile-commands";
import { AppCopy } from "../../../i18n";
import { animateLayoutTransition } from "../../../motion";
import { Language, SocialProvider, UserProfile } from "../../../types";
import { buildEditableSocialValue } from "../profile-model";
import {
  LinkDialogState,
  ProfileEditorActions,
} from "./types";

interface ProfileEditorActionSetters {
  setAvatarDialogVisible: Dispatch<SetStateAction<boolean>>;
  setDraftProfile: Dispatch<SetStateAction<UserProfile>>;
  setInterestDialogVisible: Dispatch<SetStateAction<boolean>>;
  setInterestDraft: Dispatch<SetStateAction<string>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setLinkDialog: Dispatch<SetStateAction<LinkDialogState | null>>;
}

interface BuildProfileEditorActionsParams extends ProfileEditorActionSetters {
  copy: AppCopy;
  draftProfile: UserProfile;
  interestDraft: string;
  isEditing: boolean;
  language: Language;
  linkDialog: LinkDialogState | null;
  linkDialogProvider: SocialProvider | null;
  normalizedDialogLink: string;
  onProfileChange: (profile: UserProfile) => void;
  profile: UserProfile;
}

function closeDialogs({
  setAvatarDialogVisible,
  setInterestDialogVisible,
  setLinkDialog,
}: Pick<
  ProfileEditorActionSetters,
  "setAvatarDialogVisible" | "setInterestDialogVisible" | "setLinkDialog"
>) {
  setInterestDialogVisible(false);
  setLinkDialog(null);
  setAvatarDialogVisible(false);
}

export function buildProfileEditorActions({
  copy,
  draftProfile,
  interestDraft,
  isEditing,
  language,
  linkDialog,
  linkDialogProvider,
  normalizedDialogLink,
  onProfileChange,
  profile,
  setAvatarDialogVisible,
  setDraftProfile,
  setInterestDialogVisible,
  setInterestDraft,
  setIsEditing,
  setLinkDialog,
}: BuildProfileEditorActionsParams): ProfileEditorActions {
  return {
    cancelEditing: () => {
      animateLayoutTransition();
      setDraftProfile(profile);
      setIsEditing(false);
      closeDialogs({
        setAvatarDialogVisible,
        setInterestDialogVisible,
        setLinkDialog,
      });
      setInterestDraft("");
    },
    closeAvatarDialog: () => setAvatarDialogVisible(false),
    closeInterestDialog: () => {
      setInterestDraft("");
      setInterestDialogVisible(false);
    },
    closeLinkDialog: () => setLinkDialog(null),
    openAvatarDialog: () => {
      if (isEditing) {
        setAvatarDialogVisible(true);
      }
    },
    openCreateLinkDialog: () => {
      setLinkDialog({
        initialProvider: null,
        value: "",
      });
    },
    openEditLinkDialog: (provider) => {
      setLinkDialog({
        initialProvider: provider,
        value: buildEditableSocialValue(provider, draftProfile.socials[provider] ?? ""),
      });
    },
    openInterestDialog: () => setInterestDialogVisible(true),
    removeInterest: (label) => {
      animateLayoutTransition();
      setDraftProfile((current) => removeProfileInterest(current, label, language));
    },
    removeLink: () => {
      const provider = linkDialog?.initialProvider;

      if (!provider) {
        return;
      }

      animateLayoutTransition();
      setDraftProfile((current) => removeProfileSocial(current, provider));
      setLinkDialog(null);
    },
    saveEditing: () => {
      animateLayoutTransition();
      onProfileChange(finalizeProfileDraft(draftProfile));
      setIsEditing(false);
      closeDialogs({
        setAvatarDialogVisible,
        setInterestDialogVisible,
        setLinkDialog,
      });
      setInterestDraft("");
    },
    saveInterest: () => {
      animateLayoutTransition();
      setDraftProfile((current) => addProfileInterest(current, interestDraft, language));
      setInterestDraft("");
      setInterestDialogVisible(false);
    },
    saveLink: () => {
      if (!linkDialog || !linkDialogProvider || !normalizedDialogLink) {
        return;
      }

      animateLayoutTransition();
      setDraftProfile((current) =>
        upsertProfileSocial(current, linkDialogProvider, linkDialog.value, linkDialog.initialProvider),
      );
      setLinkDialog(null);
    },
    selectAvatar: (avatarUrl) => {
      setDraftProfile((current) => setProfileAvatar(current, avatarUrl));
    },
    setFullName: (value) => {
      setDraftProfile((current) => setProfileFullName(current, value));
    },
    setHeadline: (value) => {
      setDraftProfile((current) => setLocalizedProfileField(current, "headline", language, value));
    },
    setInterestDraft,
    setLinkValue: (value) => {
      setLinkDialog((current) => (current ? { ...current, value } : current));
    },
    setSubtitle: (value) => {
      setDraftProfile((current) => setLocalizedProfileField(current, "role", language, value));
    },
    startEditing: () => {
      animateLayoutTransition();
      setDraftProfile(createEditableProfileDraft(profile, language, copy.common.at));
      setIsEditing(true);
    },
  };
}
