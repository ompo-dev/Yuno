import { useMemo } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { NoteEventTag, tokenizeNoteBody } from "../noteTags";
import { theme } from "../theme";
import { InfoChip } from "./InfoChip";

interface RichNoteTextProps {
  body: string;
  events: NoteEventTag[];
  onTagPress?: (range: { end: number; event: NoteEventTag; start: number }) => void;
  selection?: { end: number; start: number };
  showCursor?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function RichNoteText({
  body,
  events,
  onTagPress,
  selection,
  showCursor = false,
  style,
  textStyle,
}: RichNoteTextProps) {
  const tokens = useMemo(() => tokenizeNoteBody(body, events), [body, events]);
  const cursorIndex = selection?.start ?? body.length;
  let hasRenderedCursor = false;

  const renderCursor = (key: string) => {
    hasRenderedCursor = true;
    return <View key={key} style={styles.cursor} />;
  };

  const nodes = tokens.flatMap((token, index) => {
    if (token.type === "tag") {
      const items = [];

      if (showCursor && cursorIndex === token.start) {
        items.push(renderCursor(`cursor-start-${index}`));
      }

      items.push(
        <InfoChip
          compact
          icon="people-outline"
          key={`${token.event.id}-${index}`}
          label={token.event.label}
          onPress={onTagPress ? () => onTagPress(token) : undefined}
          style={styles.tag}
          tone={
            token.event.tone === "green"
              ? "green"
              : token.event.tone === "purple"
                ? "purple"
                : "blue"
          }
        />,
      );

      if (showCursor && cursorIndex === token.end) {
        items.push(renderCursor(`cursor-end-${index}`));
      }

      return items;
    }

    if (showCursor && cursorIndex >= token.start && cursorIndex <= token.end) {
      const splitIndex = cursorIndex - token.start;
      const before = token.value.slice(0, splitIndex);
      const after = token.value.slice(splitIndex);

      return [
        before ? (
          <Text key={`text-before-${index}`} style={[styles.text, textStyle]}>
            {before}
          </Text>
        ) : null,
        renderCursor(`cursor-text-${index}`),
        after ? (
          <Text key={`text-after-${index}`} style={[styles.text, textStyle]}>
            {after}
          </Text>
        ) : null,
      ].filter(Boolean);
    }

    return (
      <Text key={`text-${index}`} style={[styles.text, textStyle]}>
        {token.value}
      </Text>
    );
  });

  if (showCursor && !hasRenderedCursor) {
    nodes.push(renderCursor("cursor-tail"));
  }

  return (
    <View style={[styles.wrap, style]}>
      {nodes}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tag: {
    marginVertical: 0,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.ink,
  },
  cursor: {
    width: 2,
    height: 18,
    marginHorizontal: -1,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.blue,
  },
});
