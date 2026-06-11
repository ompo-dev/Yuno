import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AppBackground } from "./src/components/AppBackground";
import { EncounterDetailModal } from "./src/components/EncounterDetailModal";
import { EventDetailModal } from "./src/components/EventDetailModal";
import { EventListModal } from "./src/components/EventListModal";
import { PeopleListModal } from "./src/components/PeopleListModal";
import { ScreenTransition } from "./src/components/ScreenTransition";
import { TabBar } from "./src/components/TabBar";
import {
  currentUser,
  initialEncounters,
  memoryNotes,
  recentEvents,
} from "./src/data/mockData";
import { getCopy, getInitialLanguage } from "./src/i18n";
import { getEncounterNoteEvents } from "./src/noteTags";
import { sortNotesByNewest } from "./src/noteUtils";
import { EventsScreen } from "./src/screens/EventsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { NotesScreen } from "./src/screens/NotesScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { Encounter, LanguageOption, MemoryNote, TabId } from "./src/types";
import { theme } from "./src/theme";

const languageOptions: LanguageOption[] = [
  { label: "EN", value: "en" },
  { label: "PT-BR", value: "pt-BR" },
];

type ActiveSheet =
  | { type: "encounter"; id: string }
  | { type: "event"; id: string }
  | { type: "people"; ids: string[]; title: string }
  | { type: "events"; ids: string[]; title: string }
  | null;

type NoteComposerState = {
  encounterId: string;
  noteId?: string;
} | null;

export default function App() {
  return (
    <SafeAreaProvider>
      <AppRoot />
    </SafeAreaProvider>
  );
}

function AppRoot() {
  const insets = useSafeAreaInsets();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [language, setLanguage] = useState(getInitialLanguage());
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [encounters, setEncounters] = useState(initialEncounters);
  const [events, setEvents] = useState(recentEvents);
  const [notes, setNotes] = useState(memoryNotes);
  const [profile, setProfile] = useState(currentUser);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [pendingSheet, setPendingSheet] = useState<ActiveSheet>(null);
  const [noteComposer, setNoteComposer] = useState<NoteComposerState>(null);
  const copy = useMemo(() => getCopy(language), [language]);
  const encounterById = useMemo(
    () => new Map(encounters.map((encounter) => [encounter.id, encounter] as const)),
    [encounters],
  );
  const eventById = useMemo(
    () => new Map(events.map((event) => [event.id, event] as const)),
    [events],
  );
  const connectedEncounters = useMemo(
    () => encounters.filter((encounter) => encounter.connected),
    [encounters],
  );
  const joinedOrRecentEvents = useMemo(
    () => events.filter((event) => event.joined || event.status === "recent"),
    [events],
  );
  const recentEncounterCount = useMemo(
    () => encounters.filter((encounter) => encounter.homeVisible !== false).length,
    [encounters],
  );
  const connectedCount = connectedEncounters.length;
  const joinedEventCount = useMemo(
    () => events.filter((event) => event.joined).length,
    [events],
  );

  const selectedEncounter = useMemo(
    () =>
      activeSheet?.type === "encounter"
        ? encounterById.get(activeSheet.id) ?? null
        : null,
    [activeSheet, encounterById],
  );
  const selectedEvent = useMemo(
    () =>
      activeSheet?.type === "event" ? eventById.get(activeSheet.id) ?? null : null,
    [activeSheet, eventById],
  );
  const selectedPeople = useMemo(
    () =>
      activeSheet?.type === "people"
        ? activeSheet.ids
            .map((id) => encounterById.get(id))
            .filter((encounter): encounter is Encounter => Boolean(encounter))
        : [],
    [activeSheet, encounterById],
  );
  const selectedEvents = useMemo(
    () =>
      activeSheet?.type === "events"
        ? activeSheet.ids
            .map((id) => eventById.get(id))
            .filter((event): event is (typeof recentEvents)[number] => Boolean(event))
        : [],
    [activeSheet, eventById],
  );
  const noteEncounter = useMemo(
    () =>
      noteComposer ? encounterById.get(noteComposer.encounterId) ?? null : null,
    [encounterById, noteComposer],
  );
  const activeNote = useMemo(
    () =>
      noteComposer?.noteId
        ? notes.find((note) => note.id === noteComposer.noteId) ?? null
        : null,
    [noteComposer, notes],
  );
  const noteSuggestedEvents = useMemo(() => {
    return getEncounterNoteEvents(selectedEncounter ?? noteEncounter, events, language);
  }, [events, language, noteEncounter, selectedEncounter]);

  const openSheet = useCallback((nextSheet: ActiveSheet) => {
    if (!nextSheet) {
      setActiveSheet(null);
      return;
    }

    if (activeSheet) {
      setPendingSheet(nextSheet);
      setActiveSheet(null);
      return;
    }

    setActiveSheet(nextSheet);
  }, [activeSheet]);

  useEffect(() => {
    if (!activeSheet && pendingSheet) {
      const timeout = setTimeout(() => {
        setActiveSheet(pendingSheet);
        setPendingSheet(null);
      }, 240);

      return () => clearTimeout(timeout);
    }
  }, [activeSheet, pendingSheet]);

  const handleToggleConnect = useCallback((encounterId: string) => {
    setEncounters((current) =>
      current.map((encounter) =>
        encounter.id === encounterId
          ? { ...encounter, connected: !encounter.connected }
          : encounter,
      ),
    );
  }, []);

  const handleToggleEventJoin = useCallback((eventId: string) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, joined: !event.joined } : event,
      ),
    );
  }, []);

  const handleToggleEventSaved = useCallback((eventId: string) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, saved: !event.saved } : event,
      ),
    );
  }, []);

  const handleSaveNote = useCallback((encounterId: string, body: string) => {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      return;
    }

    const createdAtValue = Date.now();

    setNotes((current) => [
      {
        id: `note-${createdAtValue}`,
        encounterId,
        body: {
          en: trimmedBody,
          "pt-BR": trimmedBody,
        },
        createdAt: {
          en: "Saved now",
          "pt-BR": "Salvo agora",
        },
        createdAtValue,
        },
      ...current,
    ]);
  }, []);

  const handleUpdateNote = useCallback((noteId: string, body: string) => {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      return;
    }

    const updatedAtValue = Date.now();

    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              body: {
                en: trimmedBody,
                "pt-BR": trimmedBody,
              },
              updatedAt: {
                en: "Edited now",
                "pt-BR": "Editado agora",
              },
              updatedAtValue,
            }
          : note,
      ),
    );
  }, []);

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((current) => current.filter((note) => note.id !== noteId));
  }, []);

  const handleOpenEncounterSheet = useCallback(
    (encounter: Encounter) => openSheet({ type: "encounter", id: encounter.id }),
    [openSheet],
  );
  const handleOpenEventSheet = useCallback(
    (event: (typeof recentEvents)[number]) => openSheet({ type: "event", id: event.id }),
    [openSheet],
  );
  const handleCloseSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);
  const handleCloseEncounterSheet = useCallback(() => {
    setActiveSheet(null);
    setNoteComposer(null);
  }, []);
  const handleCloseNoteComposer = useCallback(() => {
    setNoteComposer(null);
  }, []);
  const handleRequestCreateNote = useCallback((encounterId: string) => {
    setNoteComposer({ encounterId });
  }, []);
  const handleEditNote = useCallback((note: MemoryNote) => {
    setNoteComposer({
      encounterId: note.encounterId,
      noteId: note.id,
    });
  }, []);
  const handleOpenConnections = useCallback(
    () =>
      openSheet({
        type: "people",
        ids: connectedEncounters.map((item) => item.id),
        title: copy.profile.connectionsTitle,
      }),
    [connectedEncounters, copy.profile.connectionsTitle, openSheet],
  );
  const handleOpenEvents = useCallback(
    () =>
      openSheet({
        type: "events",
        ids: joinedOrRecentEvents.map((item) => item.id),
        title: copy.profile.eventsTitle,
      }),
    [copy.profile.eventsTitle, joinedOrRecentEvents, openSheet],
  );

  const activeScreen = useMemo(() => {
    switch (activeTab) {
      case "events":
        return (
          <EventsScreen
            copy={copy}
            encounters={encounters}
            events={events}
            language={language}
            onOpenEvent={handleOpenEventSheet}
            onToggleSaved={handleToggleEventSaved}
          />
        );
      case "notes":
        return (
          <NotesScreen
            copy={copy}
            encounters={encounters}
            events={events}
            language={language}
            notes={notes}
            onOpenEncounter={handleOpenEncounterSheet}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            copy={copy}
            connectedCount={connectedCount}
            encounters={encounters}
            events={events}
            language={language}
            languageOptions={languageOptions}
            onLanguageChange={setLanguage}
            onOpenConnections={handleOpenConnections}
            onOpenEncounter={handleOpenEncounterSheet}
            onOpenEvents={handleOpenEvents}
            onProfileChange={setProfile}
            profile={profile}
            joinedEventCount={joinedEventCount}
            recentEncounterCount={recentEncounterCount}
          />
        );
      case "home":
      default:
        return (
          <HomeScreen
            copy={copy}
            discoverable={isDiscoverable}
            encounters={encounters}
            language={language}
            onDiscoverableChange={setIsDiscoverable}
            onOpenEncounter={handleOpenEncounterSheet}
          />
        );
    }
  }, [
    activeTab,
    copy,
    encounters,
    events,
    handleOpenConnections,
    handleOpenEncounterSheet,
    handleOpenEventSheet,
    handleOpenEvents,
    handleToggleEventSaved,
    isDiscoverable,
    joinedEventCount,
    language,
    notes,
    profile,
    recentEncounterCount,
  ]);

  const selectedEncounterNotes = useMemo(
    () =>
      selectedEncounter
        ? sortNotesByNewest(
            notes.filter((note) => note.encounterId === selectedEncounter.id),
          )
        : ([] as MemoryNote[]),
    [notes, selectedEncounter],
  );

  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <AppBackground />
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <OnboardingScreen
            bottomInset={insets.bottom}
            copy={copy}
            language={language}
            languageOptions={languageOptions}
            onContinue={() => setHasCompletedOnboarding(true)}
            onLanguageChange={setLanguage}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <AppBackground />
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.appShell}>
          <View style={styles.content}>
            <ScreenTransition transitionKey={activeTab}>{activeScreen}</ScreenTransition>
          </View>
          <View
            style={[
              styles.tabBarWrap,
              { bottom: Math.max(14, Math.round(insets.bottom * 0.55)) },
            ]}
          >
            <TabBar
              activeTab={activeTab}
              bottomInset={insets.bottom}
              copy={copy}
              onTabPress={setActiveTab}
            />
          </View>
        </View>

        <EncounterDetailModal
          allEncounters={encounters}
          bottomInset={insets.bottom}
          composerNote={activeNote}
          copy={copy}
          encounter={selectedEncounter}
          isNoteComposerVisible={
            Boolean(noteComposer) && selectedEncounter?.id === noteComposer?.encounterId
          }
          language={language}
          onClose={handleCloseEncounterSheet}
          onCloseNoteComposer={handleCloseNoteComposer}
          onOpenMutualConnections={(title, ids) =>
            openSheet({ type: "people", ids, title })
          }
          onDeleteNote={handleDeleteNote}
          onEditNote={handleEditNote}
          onOpenEvent={(eventId) => openSheet({ type: "event", id: eventId })}
          onOpenSharedEvents={(title, ids) =>
            openSheet({ type: "events", ids, title })
          }
          onRequestCreateNote={handleRequestCreateNote}
          onSaveNote={(body) => {
            if (!noteEncounter) {
              return;
            }

            if (activeNote) {
              handleUpdateNote(activeNote.id, body);
            } else {
              handleSaveNote(noteEncounter.id, body);
            }

            setNoteComposer(null);
          }}
          suggestedEvents={noteSuggestedEvents}
          onToggleConnect={handleToggleConnect}
          savedNotes={selectedEncounterNotes}
          visible={activeSheet?.type === "encounter"}
        />

        <EventDetailModal
          bottomInset={insets.bottom}
          copy={copy}
          encounters={encounters}
          event={selectedEvent}
          language={language}
          onClose={handleCloseSheet}
          onOpenEncounter={handleOpenEncounterSheet}
          onToggleJoin={handleToggleEventJoin}
          onToggleSaved={handleToggleEventSaved}
          visible={activeSheet?.type === "event"}
        />

        <PeopleListModal
          bottomInset={insets.bottom}
          copy={copy}
          encounters={selectedPeople}
          language={language}
          onClose={handleCloseSheet}
          onOpenEncounter={handleOpenEncounterSheet}
          title={activeSheet?.type === "people" ? activeSheet.title : ""}
          visible={activeSheet?.type === "people"}
        />

        <EventListModal
          bottomInset={insets.bottom}
          copy={copy}
          encounters={encounters}
          events={selectedEvents}
          language={language}
          onClose={handleCloseSheet}
          onOpenEvent={handleOpenEventSheet}
          onToggleSaved={handleToggleEventSaved}
          title={activeSheet?.type === "events" ? activeSheet.title : ""}
          visible={activeSheet?.type === "events"}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  tabBarWrap: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 0,
    paddingBottom: 0,
    backgroundColor: "transparent",
  },
});
