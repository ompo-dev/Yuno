import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { theme } from "../../../theme";
import { InfoChip } from "../../../components/atoms";
import { AvatarStack } from "../../../components/molecules";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailMetrics() {
  const { actions, derived, props } = useEncounterDetailContext();

  if (!derived.activeEncounter) {
    return null;
  }

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.description}>
          {resolveLocalizedText(derived.activeEncounter.description, props.language)}
        </Text>
      </View>

      <View style={styles.metricRow}>
        <InfoChip
          icon="calendar-outline"
          label={props.copy.detail.sharedEvents(derived.activeEncounter.sharedEventIds.length)}
          onPress={actions.openSharedEventsSheet}
          style={styles.metricChip}
        />

        {derived.mutualConnections.length ? (
          <InfoChip
            label={
              derived.mutualConnections.length < 4
                ? props.copy.detail.mutualConnectionsLabel
                : props.copy.detail.mutualConnections(derived.mutualConnections.length)
            }
            leftSlot={
              <AvatarStack encounters={derived.mutualConnections} max={3} size={14.3} />
            }
            onPress={actions.openMutualConnectionsSheet}
            style={styles.metricChip}
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.ink,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  metricChip: {
    maxWidth: "100%",
  },
});
