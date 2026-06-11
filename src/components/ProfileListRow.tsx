import { Ionicons } from "@expo/vector-icons";
import { memo, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../i18n";
import { Encounter, Language } from "../types";
import { theme } from "../theme";
import { InitialsAvatar } from "./InitialsAvatar";
import { MotionPressable } from "./MotionPressable";

interface ProfileListRowProps {
  encounter: Encounter;
  language: Language;
  onPress: (encounter: Encounter) => void;
  subtitle?: string;
  trailing?: ReactNode;
}

export const ProfileListRow = memo(function ProfileListRow({
  encounter,
  language,
  onPress,
  subtitle,
  trailing,
}: ProfileListRowProps) {
  return (
    <MotionPressable
      contentStyle={styles.row}
      onPress={() => onPress(encounter)}
      pressScale={0.987}
    >
      <InitialsAvatar
        gradient={encounter.gradient}
        imageUrl={encounter.avatarUrl}
        initials={encounter.initials}
        size={42}
      />

      <View style={styles.copy}>
        <Text style={styles.name}>{encounter.name}</Text>
        <Text style={styles.subtitle}>
          {subtitle ??
            `${resolveLocalizedText(encounter.role, language)} ${encounter.company}`}
        </Text>
      </View>

      {trailing ?? (
        <Ionicons color={theme.colors.muted} name="chevron-forward" size={16} />
      )}
    </MotionPressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
});
