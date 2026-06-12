import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Encounter, Language } from "../../../types";
import { theme } from "../../../theme";
import { AvatarInfoChip, ProfileListRow } from "../../../components/molecules";

interface EventDetailPeopleSectionProps {
  avatarLabel: string;
  encounters: Encounter[];
  labelColor?: string;
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
  title: string;
  trailing?: (encounter: Encounter) => ReactNode;
}

export function EventDetailPeopleSection({
  avatarLabel,
  encounters,
  labelColor,
  language,
  onOpenEncounter,
  title,
  trailing,
}: EventDetailPeopleSectionProps) {
  if (!encounters.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <AvatarInfoChip
          avatarSize={14.3}
          encounters={encounters}
          label={avatarLabel}
          labelColor={labelColor}
          style={labelColor ? styles.guestChip : undefined}
        />
      </View>

      <View style={styles.peopleList}>
        {encounters.map((encounter) => (
          <ProfileListRow
            encounter={encounter}
            key={encounter.id}
            language={language}
            onPress={onOpenEncounter}
            trailing={trailing?.(encounter)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  peopleList: {
    gap: 10,
  },
  guestChip: {
    borderColor: "#E1D7FF",
    backgroundColor: "#F3EEFF",
  },
});
