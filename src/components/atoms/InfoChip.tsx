import { Ionicons } from "@expo/vector-icons";
import { memo, ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { theme } from "../../theme";
import { MotionPressable } from "./MotionPressable";

type ChipTone = "neutral" | "blue" | "green" | "purple";

interface InfoChipProps {
  compact?: boolean;
  fill?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  leftSlot?: ReactNode;
  onPress?: () => void;
  rightSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: ChipTone;
}

const toneStyles: Record<
  ChipTone,
  {
    backgroundColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
  }
> = {
  neutral: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.lineStrong,
    iconColor: theme.colors.muted,
    textColor: theme.colors.muted,
  },
  blue: {
    backgroundColor: theme.colors.blueSoft,
    borderColor: "#D8E9FF",
    iconColor: theme.colors.blue,
    textColor: theme.colors.blue,
  },
  green: {
    backgroundColor: theme.colors.greenSoft,
    borderColor: "#D5EEDC",
    iconColor: theme.colors.green,
    textColor: theme.colors.green,
  },
  purple: {
    backgroundColor: "#F3EEFF",
    borderColor: "#E1D7FF",
    iconColor: theme.colors.rose,
    textColor: theme.colors.rose,
  },
};

export const InfoChip = memo(function InfoChip({
  compact = false,
  fill = false,
  icon,
  iconColor,
  iconSize,
  label,
  labelStyle,
  leftSlot,
  onPress,
  rightSlot,
  style,
  tone = "neutral",
}: InfoChipProps) {
  const colors = toneStyles[tone];
  const resolvedIconColor = iconColor ?? colors.iconColor;
  const resolvedIconSize = iconSize ?? 13;
  const content = (
    <>
      {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}
      {icon ? <Ionicons color={resolvedIconColor} name={icon} size={resolvedIconSize} /> : null}
      {label ? (
        <Text
          style={[
            styles.label,
            fill ? styles.labelFill : null,
            { color: colors.textColor },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      {rightSlot ? <View style={styles.trailing}>{rightSlot}</View> : null}
    </>
  );
  const chipStyle = [
    styles.chip,
    compact ? styles.chipCompact : null,
    fill ? styles.chipFill : null,
    {
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    },
    style,
  ];

  if (onPress) {
    return (
      <MotionPressable
        contentStyle={chipStyle}
        onPress={onPress}
        pressScale={0.985}
        style={fill ? styles.pressableFill : undefined}
      >
        {content}
      </MotionPressable>
    );
  }

  return <View style={[fill ? styles.pressableFill : null, chipStyle]}>{content}</View>;
});

const styles = StyleSheet.create({
  chip: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 30.3,
    maxHeight: 30.3,
    paddingHorizontal: 7,
    paddingVertical: 0,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  chipCompact: {
    height: 24,
    minHeight: 24,
    maxHeight: 24,
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  chipFill: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  label: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 14.3,
    fontWeight: "600",
  },
  labelFill: {
    flex: 1,
    minWidth: 0,
  },
  pressableFill: {
    flex: 1,
    minWidth: 0,
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
  },
  trailing: {
    alignItems: "center",
    justifyContent: "center",
  },
});
