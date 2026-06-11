import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";

import { theme } from "../../theme";
import { MotionPressable } from "../MotionPressable";

interface OnboardingProviderButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone: "dark" | "light";
}

export function OnboardingProviderButton({
  icon,
  label,
  onPress,
  tone,
}: OnboardingProviderButtonProps) {
  const isDark = tone === "dark";

  return (
    <MotionPressable
      contentStyle={[
        styles.button,
        isDark ? styles.buttonDark : styles.buttonLight,
      ]}
      onPress={onPress}
      pressScale={0.985}
    >
      <Ionicons
        color={isDark ? "#FFFFFF" : theme.colors.ink}
        name={icon}
        size={18}
      />
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
        {label}
      </Text>
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 56,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    ...theme.shadow.floating,
  },
  buttonDark: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  buttonLight: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.line,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  labelDark: {
    color: "#FFFFFF",
  },
  labelLight: {
    color: theme.colors.ink,
  },
});
