import {
  EncounterDetailModal,
  EventDetailModal,
  EventListModal,
  PeopleListModal,
} from "../../components/organisms";
import { useAppShellContext } from "./AppShellContext";

export function AppModalLayer() {
  const {
    actions,
    bottomInset,
    copy,
    derived,
    language,
    openEncounterSheet,
    openEventSheet,
    state,
  } = useAppShellContext();

  return (
    <>
      <EncounterDetailModal
        allEncounters={state.encounters}
        bottomInset={bottomInset}
        composerNote={derived.activeNote}
        copy={copy}
        encounter={derived.selectedEncounter}
        isNoteComposerVisible={
          Boolean(state.noteComposer) &&
          derived.selectedEncounter?.id === state.noteComposer?.encounterId
        }
        language={language}
        onClose={actions.closeEncounterSheet}
        onCloseNoteComposer={actions.closeNoteComposer}
        onDeleteNote={actions.removeNote}
        onEditNote={actions.requestEditNote}
        onOpenEvent={openEventSheet}
        onOpenMutualConnections={(title: string, ids: string[]) =>
          actions.openSheet({ type: "people", ids, title })
        }
        onOpenSharedEvents={(title: string, ids: string[]) =>
          actions.openSheet({ type: "events", ids, title })
        }
        onRequestCreateNote={actions.requestCreateNote}
        onSaveNote={actions.persistComposerBody}
        onToggleConnect={actions.toggleConnect}
        savedNotes={derived.selectedEncounterNotes}
        suggestedEvents={derived.noteSuggestedEvents}
        visible={state.activeSheet?.type === "encounter"}
      />

      <EventDetailModal
        bottomInset={bottomInset}
        copy={copy}
        encounters={state.encounters}
        event={derived.selectedEvent}
        language={language}
        onClose={actions.closeSheet}
        onOpenEncounter={openEncounterSheet}
        onToggleJoin={actions.toggleJoinEvent}
        onToggleSaved={actions.toggleSaveEvent}
        visible={state.activeSheet?.type === "event"}
      />

      <PeopleListModal
        bottomInset={bottomInset}
        copy={copy}
        encounters={derived.selectedPeople}
        language={language}
        onClose={actions.closeSheet}
        onOpenEncounter={openEncounterSheet}
        title={state.activeSheet?.type === "people" ? state.activeSheet.title : ""}
        visible={state.activeSheet?.type === "people"}
      />

      <EventListModal
        bottomInset={bottomInset}
        copy={copy}
        encounters={state.encounters}
        events={derived.selectedEvents}
        language={language}
        onClose={actions.closeSheet}
        onOpenEvent={(event) => openEventSheet(event.id)}
        onToggleSaved={actions.toggleSaveEvent}
        title={state.activeSheet?.type === "events" ? state.activeSheet.title : ""}
        visible={state.activeSheet?.type === "events"}
      />
    </>
  );
}
