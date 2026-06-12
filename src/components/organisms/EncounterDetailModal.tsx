import { StyleSheet, View } from "react-native";

import {
  EncounterDetailActionsSection,
  EncounterDetailFloatingMenu,
  EncounterDetailHero,
  EncounterDetailMetrics,
  EncounterDetailNotesSection,
  EncounterDetailRestrictedCard,
} from "../../features/encounter-detail/components";
import {
  EncounterDetailProvider,
  EncounterDetailProviderProps,
  useEncounterDetailContext,
} from "../../features/encounter-detail/context";
import { ActionPillButton } from "../molecules";
import { BottomSheetModal } from "./BottomSheetModal";
import { NoteComposerModal } from "./NoteComposerModal";

export type EncounterDetailModalProps = EncounterDetailProviderProps;

export function EncounterDetailModal(props: EncounterDetailModalProps) {
  return (
    <EncounterDetailProvider {...props}>
      <EncounterDetailSheet />
    </EncounterDetailProvider>
  );
}

function EncounterDetailSheet() {
  const { actions, derived, props } = useEncounterDetailContext();

  if (!derived.activeEncounter) {
    return null;
  }

  const footer = derived.canInteract ? (
    <ActionPillButton
      fill
      icon={derived.activeEncounter.connected ? "checkmark-circle" : "arrow-forward"}
      label={
        derived.activeEncounter.connected
          ? props.copy.detail.saved
          : props.copy.detail.connect
      }
      onPress={actions.toggleConnect}
      tone={derived.activeEncounter.connected ? "green" : "dark"}
    />
  ) : null;

  return (
    <BottomSheetModal
      bodyStyle={styles.body}
      bottomInset={props.bottomInset}
      footer={footer}
      freezeKeyboardInset={props.isNoteComposerVisible}
      onClose={actions.closeSheet}
      overlayContent={
        <>
          <EncounterDetailFloatingMenu />
          <NoteComposerModal
            bottomInset={props.bottomInset}
            copy={props.copy}
            encounter={derived.activeEncounter}
            language={props.language}
            note={props.composerNote}
            onClose={props.onCloseNoteComposer}
            onSave={props.onSaveNote}
            suggestedEvents={props.suggestedEvents}
            visible={props.isNoteComposerVisible}
          />
        </>
      }
      visible={props.visible}
    >
      <View style={styles.contentWrap}>
        <EncounterDetailHero />
        <EncounterDetailMetrics />
        {derived.canInteract ? (
          <>
            <EncounterDetailActionsSection />
            <EncounterDetailNotesSection />
          </>
        ) : (
          <EncounterDetailRestrictedCard />
        )}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 18,
  },
  contentWrap: {
    position: "relative",
    gap: 18,
  },
});
