import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

import {
  normalizeSocialValue,
  socialProviderConfig,
} from "../socialLinks";
import { SocialProvider } from "../types";
import { theme } from "../theme";
import { KeyboardAccessory, keyboardAccessoryId } from "./KeyboardAccessory";
import { MotionPressable } from "./MotionPressable";

interface SocialInputRowProps {
  onChange: (value: string) => void;
  onRemove?: () => void;
  provider: SocialProvider;
  value: string;
}

export function SocialInputRow({
  onChange,
  onRemove,
  provider,
  value,
}: SocialInputRowProps) {
  const config = socialProviderConfig[provider];

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
      >
        <Ionicons color={config.iconColor} name={config.icon} size={16} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{config.label}</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
          onChangeText={(nextValue) => onChange(normalizeSocialValue(provider, nextValue))}
          placeholder={config.label}
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
          value={value}
        />
        <KeyboardAccessory />
      </View>

      {onRemove ? (
        <MotionPressable contentStyle={styles.removeButton} onPress={onRemove}>
          <Ionicons color={theme.colors.muted} name="trash-outline" size={16} />
        </MotionPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  input: {
    minHeight: 44,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.ink,
  },
  removeButton: {
    width: 42,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
});
