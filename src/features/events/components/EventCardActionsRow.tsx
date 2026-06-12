import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { AvatarInfoChip, AvatarStack } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary } from "../../../types";
import { theme } from "../../../theme";

interface EventCardActionsRowProps {
  connectedAttendees: Encounter[];
  copy: AppCopy;
  event: EventSummary;
  guests: Encounter[];
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

export function EventCardActionsRow({
  connectedAttendees,
  copy,
  event,
  guests,
  onOpenEvent,
  onToggleSaved,
}: EventCardActionsRowProps) {
  return (
    <View style={styles.actionsRow}>
      {guests.length ? (
        <AvatarInfoChip
          avatarSize={14.3}
          encounters={guests}
          label={guests.length > 1 ? `${guests.length}` : ""}
          labelColor={theme.colors.rose}
          style={styles.guestChip}
        />
      ) : null}

      <InfoChip
        fill
        label={copy.events.viewEvent}
        leftSlot={
          connectedAttendees.length ? (
            <AvatarStack encounters={connectedAttendees} max={3} size={14.3} />
          ) : (
            <View style={styles.emptyLeadingSlot} />
          )
        }
        labelStyle={styles.viewEventLabel}
        onPress={() => onOpenEvent(event)}
        rightSlot={<Ionicons color={theme.colors.ink} name="arrow-forward" size={14} />}
        style={styles.viewEventChip}
      />

      <InfoChip
        icon={event.saved ? "bookmark" : "bookmark-outline"}
        iconColor={event.saved ? theme.colors.ink : theme.colors.muted}
        iconSize={18}
        onPress={() => onToggleSaved(event.id)}
        style={[styles.saveChip, event.saved && styles.saveChipActive]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  viewEventChip: {
    flex: 1,
    minWidth: 0,
  },
  viewEventLabel: {
    textAlign: "center",
  },
  emptyLeadingSlot: {
    width: 20,
  },
  guestChip: {
    borderColor: "#E1D7FF",
    backgroundColor: "#F3EEFF",
  },
  saveChip: {
    minWidth: 30,
  },
  saveChipActive: {
    backgroundColor: "#EEF2F6",
  },
});
