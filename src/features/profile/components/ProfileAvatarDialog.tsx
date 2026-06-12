import { StyleSheet, Text, View } from "react-native";

import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { InitialsAvatar, MotionPressable } from "../../../components/atoms";
import { ProfileDialog } from "../../../components/organisms";
import { useProfileEditorContext } from "../context";
import { avatarOptions } from "../profile-model";

interface ProfileAvatarDialogProps {
  copy: AppCopy;
}

export function ProfileAvatarDialog({ copy }: ProfileAvatarDialogProps) {
  const { actions, derived } = useProfileEditorContext();

  return (
    <ProfileDialog
      footer={
        <MotionPressable contentStyle={styles.primaryButton} onPress={actions.closeAvatarDialog}>
          <Text style={styles.primaryLabel}>{copy.profile.done}</Text>
        </MotionPressable>
      }
      onClose={actions.closeAvatarDialog}
      subtitle={copy.profile.changePhotoHint}
      title={copy.profile.changePhoto}
      visible={derived.isAvatarDialogVisible}
    >
      <View style={styles.avatarGrid}>
        {avatarOptions.map((avatarUrl) => {
          const isActive = avatarUrl === derived.currentProfile.avatarUrl;

          return (
            <MotionPressable
              contentStyle={[styles.avatarOption, isActive && styles.avatarOptionActive]}
              key={avatarUrl}
              onPress={() => actions.selectAvatar(avatarUrl)}
            >
              <InitialsAvatar
                gradient={["#8EA3FF", "#4E66F7"]}
                imageUrl={avatarUrl}
                initials={derived.currentInitials}
                size={58}
              />
            </MotionPressable>
          );
        })}
      </View>
    </ProfileDialog>
  );
}

const styles = StyleSheet.create({
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarOption: {
    width: 74,
    height: 74,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  avatarOptionActive: {
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.blueSoft,
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
