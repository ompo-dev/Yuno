import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { theme } from "../../../theme";
import { InfoChip } from "../../../components/atoms";
import { useEventDetailContext } from "../context";

export function EventDetailHero() {
  const { derived, props } = useEventDetailContext();

  if (!derived.activeEvent) {
    return null;
  }

  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <InfoChip
          icon="pulse-outline"
          label={props.copy.events.status[derived.activeEvent.status]}
          tone={derived.statusTone}
        />
      </View>

      <Text style={styles.title}>
        {resolveLocalizedText(derived.activeEvent.name, props.language)}
      </Text>

      <View style={styles.heroContentRow}>
        <Text style={styles.summary}>
          {resolveLocalizedText(derived.activeEvent.summary, props.language)}
        </Text>

        <View style={styles.metaStack}>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="calendar-outline" size={15} />
            <Text style={styles.metaText}>{derived.timeRange.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="time-outline" size={15} />
            <Text style={styles.metaText}>{derived.timeRange.time}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="location-outline" size={15} />
            <Text style={styles.metaText}>
              {resolveLocalizedText(derived.activeEvent.venue, props.language)}
            </Text>
          </View>
          <InfoChip
            icon="people-outline"
            label={`${derived.activeEvent.participants}`}
            tone="neutral"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  heroTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  summary: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  metaStack: {
    width: 148,
    gap: 8,
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
