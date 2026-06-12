import { createContext, ReactNode, useContext } from "react";

import { AppCopy } from "../../../i18n";
import { Language, UserProfile } from "../../../types";
import { useProfileEditorState } from "./useProfileEditorState";
import { ProfileEditorContextValue } from "./types";

interface ProfileEditorProviderProps {
  children: ReactNode;
  copy: AppCopy;
  language: Language;
  onProfileChange: (profile: UserProfile) => void;
  profile: UserProfile;
}

const ProfileEditorContext = createContext<ProfileEditorContextValue | null>(null);

export function ProfileEditorProvider({
  children,
  copy,
  language,
  onProfileChange,
  profile,
}: ProfileEditorProviderProps) {
  const value = useProfileEditorState({
    copy,
    language,
    onProfileChange,
    profile,
  });

  return <ProfileEditorContext.Provider value={value}>{children}</ProfileEditorContext.Provider>;
}

export function useProfileEditorContext() {
  const context = useContext(ProfileEditorContext);

  if (!context) {
    throw new Error("useProfileEditorContext must be used inside ProfileEditorProvider");
  }

  return context;
}
