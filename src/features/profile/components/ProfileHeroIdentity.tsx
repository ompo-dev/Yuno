import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import {
  InitialsAvatar,
  MotionPressable,
} from "../../../components/atoms";
import { AppCopy, resolveLocalizedText } from "../../../i18n";
import { Language } from "../../../types";
import { theme } from "../../../theme";
import { useProfileEditorContext } from "../context";
import { ProfileEditableText } from "./ProfileEditableText";

interface ProfileHeroIdentityProps {
  copy: AppCopy;
  inputAccessoryViewID?: string;
  language: Language;
}

export function ProfileHeroIdentity({
  copy,
  inputAccessoryViewID,
  language,
}: ProfileHeroIdentityProps) {
  const { actions, derived, state } = useProfileEditorContext();

  return (
    <View style={styles.profileTop}>
      <MotionPressable
        contentStyle={styles.avatarButton}
        onPress={actions.openAvatarDialog}
        pressScale={state.isEditing ? 0.985 : 1}
      >
        <InitialsAvatar
          gradient={["#8EA3FF", "#4E66F7"]}
          imageUrl={derived.currentProfile.avatarUrl}
          initials={derived.currentInitials}
          size={72}
        />

        {state.isEditing ? (
          <BlurView intensity={28} style={styles.avatarOverlay} tint="dark">
            <Ionicons color={theme.colors.white} name="image-outline" size={18} />
          </BlurView>
        ) : null}
      </MotionPressable>

      <View style={styles.profileMeta}>
        <ProfileEditableText
          inputAccessoryViewID={inputAccessoryViewID}
          isEditing={state.isEditing}
          onChangeText={actions.setFullName}
          placeholder={copy.profile.fullNameLabel}
          style={styles.name}
          value={derived.currentProfile.fullName}
        />

        <ProfileEditableText
          inputAccessoryViewID={inputAccessoryViewID}
          isEditing={state.isEditing}
          onChangeText={actions.setSubtitle}
          placeholder={copy.profile.subtitleLabel}
          style={styles.role}
          value={resolveLocalizedText(derived.currentProfile.role, language)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileTop: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 16,
  },
  avatarButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.16)",
  },
  profileMeta: {
    flex: 1,
    minHeight: 72,
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  role: {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: theme.colors.ink,
  },
});
