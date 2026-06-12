import { Keyboard, Platform, StyleSheet, Text, View, InputAccessoryView } from "react-native";

import { theme } from "../../theme";
import { MotionPressable } from "../atoms/MotionPressable";

export const keyboardAccessoryId = "yuno-keyboard-accessory";

interface KeyboardAccessoryProps {
  label?: string;
}

export function KeyboardAccessory({
  label = "Done",
}: KeyboardAccessoryProps) {
  if (Platform.OS !== "ios") {
    return null;
  }

  return (
    <InputAccessoryView backgroundColor="transparent" nativeID={keyboardAccessoryId}>
      <View style={styles.wrap}>
        <MotionPressable
          contentStyle={styles.button}
          onPress={() => Keyboard.dismiss()}
          pressScale={0.985}
        >
          <Text style={styles.label}>{label}</Text>
        </MotionPressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    backgroundColor: "rgba(246,248,250,0.96)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  button: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ink,
  },
});
