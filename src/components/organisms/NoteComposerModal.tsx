import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { AppCopy } from "../../i18n";
import { NoteComposerHeader, NoteComposerSuggestions } from "../../features/notes/components";
import { useNoteComposerState } from "../../features/notes/hooks";
import { NoteEventTag } from "../../features/notes/rich-text/model";
import { Encounter, Language, MemoryNote } from "../../types";
import { theme } from "../../theme";
import {
  ActionPillButton,
  KeyboardAccessory,
  keyboardAccessoryId,
  RichNoteInput,
} from "../molecules";

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
  const {
    appendEventTag,
    draft,
    eventSuggestions,
    handleSelectionChange,
    inputRef,
    noteEvents,
    removeEventTag,
    selection,
    setDraft,
    submit,
  } = useNoteComposerState({
    language,
    note,
    onSave,
    suggestedEvents,
    visible,
  });

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
            <NoteComposerHeader copy={copy} encounter={encounter} note={note} />

            <RichNoteInput
              autoFocus
              events={noteEvents}
              inputRef={inputRef}
              inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
              onChangeText={setDraft}
              onSelectionChange={handleSelectionChange}
              onTagPress={removeEventTag}
              placeholder={copy.detail.notePlaceholder}
              selection={selection}
              style={styles.input}
              value={draft}
            />

            <NoteComposerSuggestions events={eventSuggestions} onSelect={appendEventTag} />

            <KeyboardAccessory label={copy.common.keyboardDone} />

            <View style={styles.footer}>
              <ActionPillButton
                icon="arrow-forward"
                label={note ? copy.notes.editNote : copy.notes.addNote}
                onPress={submit}
              />
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
  input: {
    minHeight: 92,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    backgroundColor: "rgba(246,248,250,0.92)",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
});
