import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { MotionPressable } from "../../../components/atoms";
import {
  KeyboardAccessory,
  keyboardAccessoryId,
  SocialLinkPill,
} from "../../../components/molecules";
import { ProfileDialog } from "../../../components/organisms";
import { useProfileEditorContext } from "../context";

interface ProfileLinkDialogProps {
  copy: AppCopy;
}

export function ProfileLinkDialog({ copy }: ProfileLinkDialogProps) {
  const { actions, derived, state } = useProfileEditorContext();

  return (
    <ProfileDialog
      footer={
        <View style={styles.footerRow}>
          {state.linkDialog?.initialProvider ? (
            <MotionPressable contentStyle={styles.ghostButton} onPress={actions.removeLink}>
              <Text style={styles.ghostLabel}>{copy.profile.removeLink}</Text>
            </MotionPressable>
          ) : (
            <View />
          )}

          <View style={styles.footerActions}>
            <MotionPressable contentStyle={styles.ghostButton} onPress={actions.closeLinkDialog}>
              <Text style={styles.ghostLabel}>{copy.profile.cancel}</Text>
            </MotionPressable>
            <MotionPressable
              contentStyle={[
                styles.primaryButton,
                (!derived.linkDialogProvider || !derived.normalizedDialogLink) &&
                  styles.primaryDisabled,
              ]}
              onPress={actions.saveLink}
              pressScale={
                !derived.linkDialogProvider || !derived.normalizedDialogLink ? 1 : 0.985
              }
            >
              <Text style={styles.primaryLabel}>
                {state.linkDialog?.initialProvider ? copy.profile.editLink : copy.profile.addLink}
              </Text>
            </MotionPressable>
          </View>
        </View>
      }
      onClose={actions.closeLinkDialog}
      title={state.linkDialog?.initialProvider ? copy.profile.editLink : copy.profile.addLink}
      visible={derived.isLinkDialogVisible}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
        onChangeText={actions.setLinkValue}
        placeholder={copy.profile.socialLinkPlaceholder}
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        value={state.linkDialog?.value ?? ""}
      />

      {derived.linkDialogProvider && derived.normalizedDialogLink ? (
        <View style={styles.previewWrap}>
          <SocialLinkPill
            link={{
              provider: derived.linkDialogProvider,
              value: derived.normalizedDialogLink,
            }}
          />
        </View>
      ) : null}

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
  previewWrap: {
    paddingTop: 2,
  },
  footerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  primaryDisabled: {
    opacity: 0.45,
  },
  primaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
