import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../../theme";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailRestrictedCard() {
  const { props } = useEncounterDetailContext();

  return (
    <View style={styles.restrictedCard}>
      <Text style={styles.restrictedTitle}>{props.copy.detail.restrictedTitle}</Text>
      <Text style={styles.restrictedBody}>{props.copy.detail.restrictedBody}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  restrictedCard: {
    gap: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  restrictedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  restrictedBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
});
