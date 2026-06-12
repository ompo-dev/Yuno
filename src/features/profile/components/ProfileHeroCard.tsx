import { Platform, StyleSheet, View } from "react-native";

import { AppCopy, resolveLocalizedText } from "../../../i18n";
import { Language } from "../../../types";
import { theme } from "../../../theme";
import { GlassCard } from "../../../components/atoms";
import { KeyboardAccessory, keyboardAccessoryId } from "../../../components/molecules";
import { useProfileEditorContext } from "../context";
import { ProfileEditableText } from "./ProfileEditableText";
import { ProfileHeroActions } from "./ProfileHeroActions";
import { ProfileHeroIdentity } from "./ProfileHeroIdentity";
import { ProfileHeroInterests } from "./ProfileHeroInterests";
import { ProfileHeroLinks } from "./ProfileHeroLinks";
import { ProfileHeroStats } from "./ProfileHeroStats";

interface ProfileHeroCardProps {
  connectedCount: number;
  connectionEventCount: number;
  copy: AppCopy;
  language: Language;
  onOpenConnections: () => void;
  onOpenEvents: () => void;
}

export function ProfileHeroCard({
  connectedCount,
  connectionEventCount,
  copy,
  language,
  onOpenConnections,
  onOpenEvents,
}: ProfileHeroCardProps) {
  const { actions, derived, state } = useProfileEditorContext();
  const inputAccessoryViewID = Platform.OS === "ios" ? keyboardAccessoryId : undefined;

  return (
    <View style={styles.heroWrap}>
      <ProfileHeroActions copy={copy} />

      <GlassCard style={styles.heroCard}>
        <ProfileHeroIdentity
          copy={copy}
          inputAccessoryViewID={inputAccessoryViewID}
          language={language}
        />

        <ProfileHeroStats
          connectedCount={connectedCount}
          connectionEventCount={connectionEventCount}
          copy={copy}
          onOpenConnections={onOpenConnections}
          onOpenEvents={onOpenEvents}
        />

        <ProfileEditableText
          inputAccessoryViewID={inputAccessoryViewID}
          isEditing={state.isEditing}
          multiline
          onChangeText={actions.setHeadline}
          placeholder={copy.profile.headlineLabel}
          style={styles.headline}
          textAlignVertical="top"
          value={resolveLocalizedText(derived.currentProfile.headline, language)}
        />

        <ProfileHeroInterests copy={copy} language={language} />
        <ProfileHeroLinks copy={copy} />

        <KeyboardAccessory label={copy.common.keyboardDone} />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    position: "relative",
  },
  heroCard: {
    gap: 16,
    paddingTop: 22,
  },
  headline: {
    minHeight: 42,
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
});
