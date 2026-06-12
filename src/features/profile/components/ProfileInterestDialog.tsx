import { Platform, StyleSheet, Text, TextInput } from "react-native";

import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { MotionPressable } from "../../../components/atoms";
import { KeyboardAccessory, keyboardAccessoryId } from "../../../components/molecules";
import { ProfileDialog } from "../../../components/organisms";
import { useProfileEditorContext } from "../context";

interface ProfileInterestDialogProps {
  copy: AppCopy;
}

export function ProfileInterestDialog({ copy }: ProfileInterestDialogProps) {
  const { actions, derived, state } = useProfileEditorContext();

  return (
    <ProfileDialog
      footer={
        <>
          <MotionPressable contentStyle={styles.ghostButton} onPress={actions.closeInterestDialog}>
            <Text style={styles.ghostLabel}>{copy.profile.cancel}</Text>
          </MotionPressable>
          <MotionPressable contentStyle={styles.primaryButton} onPress={actions.saveInterest}>
            <Text style={styles.primaryLabel}>{copy.profile.addInterest}</Text>
          </MotionPressable>
        </>
      }
      onClose={actions.closeInterestDialog}
      subtitle={copy.profile.interestsBody}
      title={copy.profile.interestsTitle}
      visible={derived.isInterestDialogVisible}
    >
      <TextInput
        autoFocus
        inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
        onChangeText={actions.setInterestDraft}
        placeholder={copy.profile.addInterestPlaceholder}
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        value={state.interestDraft}
      />
      <KeyboardAccessory label={copy.common.keyboardDone} />
    </ProfileDialog>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.ink,
  },
  ghostButton: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ghostLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  primaryButton: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
