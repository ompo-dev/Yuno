import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { EventSummary, Language } from "../../../types";
import { theme } from "../../../theme";

interface EventCardMetaStackProps {
  event: EventSummary;
  language: Language;
  participantSlot: React.ReactNode;
  timeRange: { date: string; time: string };
}

export function EventCardMetaStack({
  event,
  language,
  participantSlot,
  timeRange,
}: EventCardMetaStackProps) {
  return (
    <View style={styles.metaStack}>
      <View style={styles.metaRow}>
        <Ionicons color={theme.colors.muted} name="calendar-outline" size={15} />
        <Text style={styles.metaText}>{timeRange.date}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons color={theme.colors.muted} name="time-outline" size={15} />
        <Text style={styles.metaText}>{timeRange.time}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons color={theme.colors.muted} name="location-outline" size={15} />
        <Text numberOfLines={2} style={styles.metaText}>
          {resolveLocalizedText(event.venue, language)}
        </Text>
      </View>

      {participantSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  metaStack: {
    width: 128,
    gap: 8,
    paddingTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.muted,
  },
});
