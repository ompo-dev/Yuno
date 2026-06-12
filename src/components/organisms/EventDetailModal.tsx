import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { EventDetailHero, EventDetailPeopleSection } from "../../features/event-detail/components";
import {
  EventDetailProvider,
  EventDetailProviderProps,
  useEventDetailContext,
} from "../../features/event-detail/context";
import { theme } from "../../theme";
import { InfoChip, MotionPressable } from "../atoms";
import { ActionPillButton } from "../molecules";
import { BottomSheetModal } from "./BottomSheetModal";

export type EventDetailModalProps = EventDetailProviderProps;

export function EventDetailModal(props: EventDetailModalProps) {
  return (
    <EventDetailProvider {...props}>
      <EventDetailSheet />
    </EventDetailProvider>
  );
}

function EventDetailSheet() {
  const { actions, derived, props } = useEventDetailContext();

  if (!derived.activeEvent) {
    return null;
  }

  const footer = (
    <View style={styles.footerRow}>
      <ActionPillButton
        fill
        icon={derived.activeEvent.joined ? "checkmark-circle" : "arrow-forward"}
        label={
          derived.activeEvent.joined
            ? props.copy.events.leaveEvent
            : props.copy.events.joinEvent
        }
        onPress={actions.toggleJoinEvent}
        style={styles.primaryButtonWrap}
        tone={derived.activeEvent.joined ? "green" : "dark"}
      />

      <MotionPressable
        contentStyle={[
          styles.iconButton,
          derived.activeEvent.saved && styles.iconButtonActive,
        ]}
        onPress={actions.toggleSaveEvent}
        pressScale={0.97}
      >
        <Ionicons
          color={derived.activeEvent.saved ? theme.colors.ink : theme.colors.muted}
          name={derived.activeEvent.saved ? "bookmark" : "bookmark-outline"}
          size={18}
        />
      </MotionPressable>
    </View>
  );

  return (
    <BottomSheetModal
      bodyStyle={styles.body}
      bottomInset={props.bottomInset}
      footer={footer}
      onClose={actions.closeSheet}
      visible={props.visible}
    >
      <EventDetailHero />

      <EventDetailPeopleSection
        avatarLabel={derived.guests.length > 1 ? `${derived.guests.length}` : ""}
        encounters={derived.guests}
        labelColor={theme.colors.rose}
        language={props.language}
        onOpenEncounter={actions.openEncounter}
        title={props.copy.events.invitedGuestsTitle}
        trailing={() => (
          <View style={styles.trailingWrap}>
            <InfoChip
              icon="lock-closed-outline"
              label={props.copy.events.privateGuest}
              tone="neutral"
            />
          </View>
        )}
      />

      <EventDetailPeopleSection
        avatarLabel={`${derived.connectedAttendees.length}`}
        encounters={derived.connectedAttendees}
        language={props.language}
        onOpenEncounter={actions.openEncounter}
        title={props.copy.events.yourConnections}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 20,
  },
  trailingWrap: {
    alignItems: "flex-end",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryButtonWrap: {
    flex: 1,
  },
  iconButton: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  iconButtonActive: {
    backgroundColor: "#EEF2F6",
  },
});
