import { RefObject } from "react";
import {
  Pressable,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { NoteEventTag } from "../noteTags";
import { theme } from "../theme";
import { RichNoteText } from "./RichNoteText";

interface RichNoteInputProps {
  autoFocus?: boolean;
  events: NoteEventTag[];
  inputRef?: RefObject<TextInput | null>;
  inputAccessoryViewID?: string;
  minHeight?: number;
  onChangeText: (value: string) => void;
  onSelectionChange?: (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;
  onTagPress?: (range: { end: number; event: NoteEventTag; start: number }) => void;
  placeholder: string;
  selection?: { end: number; start: number };
  style?: StyleProp<ViewStyle>;
  value: string;
}

export function RichNoteInput({
  autoFocus = false,
  events,
  inputRef,
  inputAccessoryViewID,
  minHeight = 92,
  onChangeText,
  onSelectionChange,
  onTagPress,
  placeholder,
  selection,
  style,
  value,
}: RichNoteInputProps) {
  return (
    <Pressable
      onPress={() => inputRef?.current?.focus()}
      style={[styles.shell, { minHeight }, style]}
    >
      <TextInput
        autoFocus={autoFocus}
        inputAccessoryViewID={inputAccessoryViewID}
        multiline
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
        ref={inputRef}
        scrollEnabled={false}
        selection={selection}
        selectionColor={theme.colors.blue}
        style={styles.input}
        textAlignVertical="top"
        underlineColorAndroid="transparent"
        value={value}
      />

      <View pointerEvents="box-none" style={styles.content}>
        {value ? (
          <RichNoteText
            body={value}
            events={events}
            onTagPress={onTagPress}
            selection={selection}
            showCursor
            textStyle={styles.text}
          />
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    overflow: "hidden",
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  placeholder: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.muted,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.ink,
  } satisfies TextStyle,
  input: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
    left: -1000,
    top: -1000,
  },
});
