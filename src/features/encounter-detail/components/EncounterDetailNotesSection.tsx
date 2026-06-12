import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { theme } from "../../../theme";
import { InfoChip, MotionPressable } from "../../../components/atoms";
import { RichNoteText } from "../../../components/molecules";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailNotesSection() {
  const { actions, props } = useEncounterDetailContext();

  return (
    <View style={styles.section}>
      <View style={styles.sectionTopRow}>
        <Text style={styles.sectionTitle}>{props.copy.detail.notes}</Text>
        <InfoChip
          icon="add"
          label={props.copy.notes.addNote}
          onPress={actions.requestCreateNote}
        />
      </View>

      {props.savedNotes.length ? (
        <View style={styles.noteList}>
          {props.savedNotes.map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <View style={styles.noteTopRow}>
                <View style={styles.noteMetaRow}>
                  <Text style={styles.noteMeta}>
                    {resolveLocalizedText(note.createdAt, props.language)}
                  </Text>
                  {note.updatedAt ? (
                    <Text style={styles.noteMeta}>
                      {resolveLocalizedText(note.updatedAt, props.language)}
                    </Text>
                  ) : null}
                </View>

                <View
                  collapsable={false}
                  ref={(node) => actions.setNoteMenuAnchor(note.id, node)}
                  style={styles.noteMenuWrap}
                >
                  <MotionPressable
                    contentStyle={styles.noteMoreButton}
                    onPress={() => actions.toggleNoteMenu(note)}
                    pressScale={0.96}
                  >
                    <Ionicons
                      color={theme.colors.muted}
                      name="ellipsis-horizontal"
                      size={16}
                    />
                  </MotionPressable>
                </View>
              </View>

              <RichNoteText
                body={resolveLocalizedText(note.body, props.language)}
                events={props.suggestedEvents}
                textStyle={styles.noteBody}
              />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  noteList: {
    gap: 10,
  },
  noteItem: {
    gap: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  noteTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  noteMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteMeta: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  noteMenuWrap: {
    zIndex: 4,
  },
  noteMoreButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  noteBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.ink,
  },
});
