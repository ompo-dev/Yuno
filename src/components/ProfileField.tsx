import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../theme";
import { KeyboardAccessory, keyboardAccessoryId } from "./KeyboardAccessory";

interface ProfileFieldProps {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  value: string;
}

export function ProfileField({
  label,
  multiline = false,
  onChangeText,
  value,
}: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.muted}
        style={[styles.input, multiline && styles.inputMultiline]}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
      />
      <KeyboardAccessory />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  input: {
    minHeight: 46,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.ink,
  },
  inputMultiline: {
    minHeight: 92,
  },
});
