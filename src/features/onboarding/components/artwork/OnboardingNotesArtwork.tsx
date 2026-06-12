import { StyleSheet, View } from "react-native";

import { MemoryNoteCard } from "../../../../components/organisms";
import { useOnboardingArtworkContext } from "./OnboardingArtworkContext";

export function OnboardingNotesArtwork() {
  const {
    copy,
    featuredEvent,
    language,
    noteEncounter,
    noteEvents,
    previewNote,
    primaryNoteLabel,
  } = useOnboardingArtworkContext();

  return (
    <View pointerEvents="none" style={styles.notesPreview}>
      <MemoryNoteCard
        copy={copy}
        encounter={noteEncounter}
        language={language}
        note={previewNote}
        noteEvents={[
          {
            id: featuredEvent.id,
            label: primaryNoteLabel,
            tone: featuredEvent.tone,
          },
          ...noteEvents.filter((event) => event.id !== featuredEvent.id),
        ]}
        onPress={() => undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notesPreview: {
    flex: 1,
    justifyContent: "center",
    transform: [{ scale: 0.9 }],
    marginHorizontal: -12,
    marginVertical: -8,
  },
});
