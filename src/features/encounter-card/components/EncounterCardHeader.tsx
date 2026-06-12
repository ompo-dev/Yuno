import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { theme } from "../../../theme";
import { InitialsAvatar, MotionPressable } from "../../../components/atoms";

interface EncounterCardHeaderProps {
  encounter: Encounter;
  language: Language;
  onPress: (encounter: Encounter) => void;
}

export function EncounterCardHeader({
  encounter,
  language,
  onPress,
}: EncounterCardHeaderProps) {
  return (
    <MotionPressable
      contentStyle={styles.topSection}
      onPress={() => onPress(encounter)}
      pressScale={0.988}
    >
      <InitialsAvatar
        gradient={encounter.gradient}
        imageUrl={encounter.avatarUrl}
        initials={encounter.initials}
        size={58}
      />

      <View style={styles.rightColumn}>
        <View style={styles.titleRow}>
          <View style={styles.nameWrap}>
            <Text style={styles.name}>{encounter.name}</Text>
            {encounter.verified ? (
              <Ionicons color={theme.colors.blue} name="checkmark-circle" size={14} />
            ) : null}
          </View>

          <Ionicons color={theme.colors.muted} name="chevron-forward" size={16} />
        </View>

        <Text style={styles.roleLine}>
          {resolveLocalizedText(encounter.role, language)} {encounter.company}
        </Text>

        <Text numberOfLines={2} style={styles.description}>
          {resolveLocalizedText(encounter.context, language)}
        </Text>
      </View>
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  rightColumn: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  nameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  roleLine: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.ink,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
  },
});
