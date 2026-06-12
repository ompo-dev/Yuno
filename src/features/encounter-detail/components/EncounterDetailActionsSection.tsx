import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../../theme";
import { SocialLinkPill } from "../../../components/molecules";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailActionsSection() {
  const { derived, props } = useEncounterDetailContext();

  if (!derived.activeEncounter) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{props.copy.detail.actions}</Text>
      <View style={styles.socialRow}>
        {derived.activeEncounter.socials.map((social) => (
          <SocialLinkPill key={`${social.provider}-${social.value}`} link={social} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
