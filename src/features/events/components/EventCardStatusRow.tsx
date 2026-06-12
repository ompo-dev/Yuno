import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";
import { EventSummary } from "../../../types";
import { getEventCardStatusTone } from "../event-card-model";

interface EventCardStatusRowProps {
  copy: AppCopy;
  event: EventSummary;
}

export function EventCardStatusRow({
  copy,
  event,
}: EventCardStatusRowProps) {
  return (
    <View style={styles.topRow}>
      <InfoChip
        icon="pulse-outline"
        label={copy.events.status[event.status]}
        tone={getEventCardStatusTone(event.status)}
      />
      {event.joined ? (
        <InfoChip
          icon="checkmark-circle-outline"
          label={copy.events.joinedStatus}
          tone="green"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
});
