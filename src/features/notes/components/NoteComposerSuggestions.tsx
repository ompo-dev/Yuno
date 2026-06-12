import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms/InfoChip";
import { NoteEventTag } from "../rich-text/model";

interface NoteComposerSuggestionsProps {
  events: NoteEventTag[];
  onSelect: (label: string) => void;
}

export function NoteComposerSuggestions({
  events,
  onSelect,
}: NoteComposerSuggestionsProps) {
  if (!events.length) {
    return null;
  }

  return (
    <View style={styles.tagsSection}>
      <View style={styles.tagsRow}>
        {events.map((event) => (
          <InfoChip
            icon="people-outline"
            key={event.id}
            label={event.label}
            onPress={() => onSelect(event.label)}
            tone={
              event.tone === "green"
                ? "green"
                : event.tone === "purple"
                  ? "purple"
                  : "blue"
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tagsSection: {
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
