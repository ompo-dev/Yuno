import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { AppCopy, resolveLocalizedText } from "../../../i18n";
import { Language } from "../../../types";
import { theme } from "../../../theme";
import { useProfileEditorContext } from "../context";

interface ProfileHeroInterestsProps {
  copy: AppCopy;
  language: Language;
}

export function ProfileHeroInterests({
  copy,
  language,
}: ProfileHeroInterestsProps) {
  const { actions, derived, state } = useProfileEditorContext();

  return (
    <View style={styles.interests}>
      {derived.currentProfile.interests.map((interest) => {
        const label = resolveLocalizedText(interest, language);

        return (
          <InfoChip
            key={label}
            label={label}
            onPress={state.isEditing ? () => actions.removeInterest(label) : undefined}
            rightSlot={
              state.isEditing ? (
                <Ionicons color={theme.colors.muted} name="close" size={12} />
              ) : undefined
            }
          />
        );
      })}

      {state.isEditing ? (
        <InfoChip icon="add" label={copy.profile.addInterest} onPress={actions.openInterestDialog} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
