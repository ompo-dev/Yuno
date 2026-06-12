import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

import { theme } from "../../theme";
import { MotionPressable } from "../atoms";

type ActionTone = "dark" | "green";

interface ActionPillButtonProps {
  disabled?: boolean;
  fill?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: ActionTone;
}

export function ActionPillButton({
  disabled = false,
  fill = false,
  icon,
  label,
  onPress,
  style,
  tone = "dark",
}: ActionPillButtonProps) {
  return (
    <MotionPressable
      contentStyle={[
        styles.button,
        tone === "green" && styles.buttonGreen,
        disabled && styles.buttonDisabled,
      ]}
      fill={fill}
      onPress={onPress}
      pressScale={disabled ? 1 : 0.985}
      style={style}
    >
      <Text style={styles.label}>{label}</Text>
      <Ionicons color={theme.colors.white} name={icon} size={18} />
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingVertical: 18,
    borderRadius: theme.radius.pill,
    ...theme.shadow.floating,
  },
  buttonGreen: {
    backgroundColor: theme.colors.green,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
