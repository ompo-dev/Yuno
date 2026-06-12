import { useEffect, useMemo, useState } from "react";

import { UserProfile } from "../../../types";
import { buildProfileEditorActions } from "./profile-editor-actions";
import { buildProfileEditorDerived } from "./profile-editor-derived";
import {
  LinkDialogState,
  ProfileEditorContextValue,
  UseProfileEditorStateParams,
} from "./types";

export function useProfileEditorState({
  copy,
  language,
  onProfileChange,
  profile,
}: UseProfileEditorStateParams): ProfileEditorContextValue {
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
  const [interestDialogVisible, setInterestDialogVisible] = useState(false);
  const [interestDraft, setInterestDraft] = useState("");
  const [linkDialog, setLinkDialog] = useState<LinkDialogState | null>(null);
  const [avatarDialogVisible, setAvatarDialogVisible] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftProfile(profile);
    }
  }, [isEditing, profile]);

  const currentProfile = isEditing ? draftProfile : profile;
  const derived = useMemo(
    () =>
      buildProfileEditorDerived({
        avatarDialogVisible,
        copy,
        currentProfile,
        interestDialogVisible,
        language,
        linkDialog,
      }),
    [
      avatarDialogVisible,
      copy,
      currentProfile,
      interestDialogVisible,
      language,
      linkDialog,
    ],
  );
  const actions = useMemo(
    () =>
      buildProfileEditorActions({
        copy,
        draftProfile,
        interestDraft,
        isEditing,
        language,
        linkDialog,
        linkDialogProvider: derived.linkDialogProvider,
        normalizedDialogLink: derived.normalizedDialogLink,
        onProfileChange,
        profile,
        setAvatarDialogVisible,
        setDraftProfile,
        setInterestDialogVisible,
        setInterestDraft,
        setIsEditing,
        setLinkDialog,
      }),
    [
      copy,
      derived.linkDialogProvider,
      derived.normalizedDialogLink,
      draftProfile,
      interestDraft,
      isEditing,
      language,
      linkDialog,
      onProfileChange,
      profile,
    ],
  );

  return {
    actions,
    derived,
    state: {
      interestDraft,
      isEditing,
      linkDialog,
    },
  };
}
