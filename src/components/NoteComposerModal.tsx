import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";

import { AppCopy, resolveLocalizedText } from "../i18n";
import {
  hasNoteEventTag,
  insertNoteEventTagAtSelection,
  NoteEventTag,
  removeNoteEventTagAtRange,
} from "../noteTags";
import { Encounter, Language, MemoryNote } from "../types";
import { theme } from "../theme";
import { InfoChip } from "./InfoChip";
import { KeyboardAccessory, keyboardAccessoryId } from "./KeyboardAccessory";
import { MotionPressable } from "./MotionPressable";
import { RichNoteInput } from "./RichNoteInput";

interface NoteComposerModalProps {
  bottomInset: number;
  copy: AppCopy;
  encounter: Encounter | null;
  language: Language;
  note: MemoryNote | null;
  onClose: () => void;
  onSave: (body: string) => void;
  suggestedEvents: NoteEventTag[];
  visible: boolean;
}

export function NoteComposerModal({
  bottomInset,
  copy,
  encounter,
  language,
  note,
  onClose,
  onSave,
  suggestedEvents,
  visible,
}: NoteComposerModalProps) {
  const [draft, setDraft] = useState("");
  const [selection, setSelection] = useState({ end: 0, start: 0 });
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const nextDraft = note ? resolveLocalizedText(note.body, language) : "";
    setDraft(nextDraft);
    setSelection({ end: nextDraft.length, start: nextDraft.length });
  }, [language, note, visible]);

  const noteEvents = useMemo(
    () =>
      suggestedEvents.filter(
        (item, index, current) =>
          current.findIndex((entry) => entry.id === item.id) === index,
      ),
    [suggestedEvents],
  );

  const eventSuggestions = useMemo(
    () => noteEvents.filter((item) => !hasNoteEventTag(draft, item.label)),
    [draft, noteEvents],
  );

  const appendEventTag = (label: string) => {
    const nextState = insertNoteEventTagAtSelection(draft, label, selection);
    setDraft(nextState.value);
    setSelection(nextState.selection);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    setSelection(event.nativeEvent.selection);
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable onPress={onClose} style={styles.backdrop} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardLayer}
      >
        <View
          style={[
            styles.dialogWrap,
            { paddingBottom: Math.max(0, Math.round(bottomInset * 0.25)) },
          ]}
        >
          <View style={styles.dialog}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {note ? copy.notes.editNote : copy.notes.addNote}
              </Text>
              {encounter ? <Text style={styles.subtitle}>{encounter.name}</Text> : null}
            </View>

            <RichNoteInput
              autoFocus
              events={noteEvents}
              inputRef={inputRef}
              inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
              onChangeText={setDraft}
              onSelectionChange={handleSelectionChange}
              onTagPress={(range) => {
                const nextState = removeNoteEventTagAtRange(draft, range);
                setDraft(nextState.value);
                setSelection(nextState.selection);
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              placeholder={copy.detail.notePlaceholder}
              selection={selection}
              style={styles.input}
              value={draft}
            />

            {eventSuggestions.length ? (
              <View style={styles.tagsSection}>
                <View style={styles.tagsRow}>
                  {eventSuggestions.map((event) => (
                    <InfoChip
                      icon="people-outline"
                      key={event.id}
                      label={event.label}
                      onPress={() => appendEventTag(event.label)}
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
            ) : null}

            <KeyboardAccessory label={copy.common.keyboardDone} />

            <View style={styles.footer}>
              <MotionPressable
                contentStyle={styles.primaryButton}
                onPress={() => {
                  if (draft.trim()) {
                    onSave(draft);
                  }
                }}
                pressScale={0.985}
              >
                <Text style={styles.primaryButtonLabel}>
                  {note ? copy.notes.editNote : copy.notes.addNote}
                </Text>
                <Ionicons color="#FFFFFF" name="arrow-forward" size={18} />
              </MotionPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    backgroundColor: theme.colors.overlay,
    zIndex: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardLayer: {
    flex: 1,
    justifyContent: "center",
  },
  dialogWrap: {
    paddingHorizontal: 20,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadow.floating,
  },
  header: {
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  input: {
    minHeight: 92,
    marginHorizontal: 20,
    marginBottom: 12,
  },
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    backgroundColor: "rgba(246,248,250,0.92)",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingVertical: 18,
    borderRadius: theme.radius.pill,
    ...theme.shadow.floating,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
