import { AppCopy } from "../../../i18n";
import {
  Language,
  SocialLink,
  SocialProvider,
  UserProfile,
} from "../../../types";

export interface UseProfileEditorStateParams {
  copy: AppCopy;
  language: Language;
  onProfileChange: (profile: UserProfile) => void;
  profile: UserProfile;
}

export interface LinkDialogState {
  initialProvider: SocialProvider | null;
  value: string;
}

export interface ProfileEditorState {
  interestDraft: string;
  isEditing: boolean;
  linkDialog: LinkDialogState | null;
}

export interface ProfileEditorDerivedState {
  currentInitials: string;
  currentProfile: UserProfile;
  currentSubtitle: string;
  isAvatarDialogVisible: boolean;
  isInterestDialogVisible: boolean;
  isLinkDialogVisible: boolean;
  linkDialogProvider: SocialProvider | null;
  normalizedDialogLink: string;
  socialLinks: SocialLink[];
}

export interface ProfileEditorActions {
  cancelEditing: () => void;
  closeAvatarDialog: () => void;
  closeInterestDialog: () => void;
  closeLinkDialog: () => void;
  openAvatarDialog: () => void;
  openCreateLinkDialog: () => void;
  openEditLinkDialog: (provider: SocialProvider) => void;
  openInterestDialog: () => void;
  removeInterest: (label: string) => void;
  removeLink: () => void;
  saveEditing: () => void;
  saveInterest: () => void;
  saveLink: () => void;
  selectAvatar: (avatarUrl: string) => void;
  setFullName: (value: string) => void;
  setHeadline: (value: string) => void;
  setInterestDraft: (value: string) => void;
  setLinkValue: (value: string) => void;
  setSubtitle: (value: string) => void;
  startEditing: () => void;
}

export interface ProfileEditorContextValue {
  actions: ProfileEditorActions;
  derived: ProfileEditorDerivedState;
  state: ProfileEditorState;
}
