import { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import {
  dedupeNoteEvents,
  hasNoteEventTag,
  insertNoteEventTagAtSelection,
  NoteEventTag,
  removeNoteEventTagAtRange,
} from "../rich-text/model";
import { Language, MemoryNote } from "../../../types";

interface UseNoteComposerStateParams {
  language: Language;
  note: MemoryNote | null;
  onSave: (body: string) => void;
  suggestedEvents: NoteEventTag[];
  visible: boolean;
}

export function useNoteComposerState({
  language,
  note,
  onSave,
  suggestedEvents,
  visible,
}: UseNoteComposerStateParams) {
  const [draft, setDraft] = useState("");
  const [selection, setSelection] = useState({ end: 0, start: 0 });
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const nextDraft = note ? resolveLocalizedText(note.body, language) : "";
    setDraft(nextDraft);
    setSelection({ end: nextDraft.length, start: nextDraft.length });
  }, [language, note, visible]);

  const noteEvents = useMemo(() => dedupeNoteEvents(suggestedEvents), [suggestedEvents]);
  const eventSuggestions = useMemo(
    () => noteEvents.filter((item) => !hasNoteEventTag(draft, item.label)),
    [draft, noteEvents],
  );

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const appendEventTag = (label: string) => {
    const nextState = insertNoteEventTagAtSelection(draft, label, selection);
    setDraft(nextState.value);
    setSelection(nextState.selection);
    focusInput();
  };

  const removeEventTag = (range: { end: number; start: number }) => {
    const nextState = removeNoteEventTagAtRange(draft, range);
    setDraft(nextState.value);
    setSelection(nextState.selection);
    focusInput();
  };

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    setSelection(event.nativeEvent.selection);
  };

  const submit = () => {
    if (draft.trim()) {
      onSave(draft);
    }
  };

  return {
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
  };
}
