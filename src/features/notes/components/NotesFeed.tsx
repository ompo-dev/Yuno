import { StyleSheet, View } from "react-native";

import { FadeInView } from "../../../components/atoms";
import { EmptyStatePanel } from "../../../components/molecules";
import { MemoryNoteCard } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { getNotesEmptyTitle, NoteFeedItem } from "../model";

interface NotesFeedProps {
  activeFilterCount: number;
  copy: AppCopy;
  items: NoteFeedItem[];
  language: Language;
  onClearFilters: () => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function NotesFeed({
  activeFilterCount,
  copy,
  items,
  language,
  onClearFilters,
  onOpenEncounter,
}: NotesFeedProps) {
  return (
    <View style={styles.list}>
      {items.length ? (
        items.map(({ encounter, note, noteEvents }, index) => (
          <FadeInView delay={index * 45} key={note.id}>
            <MemoryNoteCard
              copy={copy}
              encounter={encounter}
              language={language}
              note={note}
              noteEvents={noteEvents}
              onPress={onOpenEncounter}
            />
          </FadeInView>
        ))
      ) : (
        <EmptyStatePanel
          actionLabel={activeFilterCount ? copy.common.clear : undefined}
          icon={activeFilterCount ? "options-outline" : "document-text-outline"}
          onAction={activeFilterCount ? onClearFilters : undefined}
          title={getNotesEmptyTitle(language, activeFilterCount > 0)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
});
