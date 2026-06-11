import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { Encounter } from "../types";
import { AvatarStack } from "./AvatarStack";
import { InfoChip } from "./InfoChip";

interface AvatarInfoChipProps {
  avatarSize?: number;
  compact?: boolean;
  encounters: Encounter[];
  fill?: boolean;
  label: string;
  labelColor?: string;
  onPress?: () => void;
  rightSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AvatarInfoChip({
  avatarSize = 14.3,
  compact = false,
  encounters,
  fill = false,
  label,
  labelColor,
  onPress,
  rightSlot,
  style,
}: AvatarInfoChipProps) {
  const numericLabel = Number(label);
  const resolvedLabel =
    Number.isFinite(numericLabel) && label.trim() !== "" && encounters.length < 4 ? "" : label;

  return (
    <InfoChip
      fill={fill}
      label={resolvedLabel}
      labelStyle={[
        compact ? styles.labelCompact : null,
        labelColor ? { color: labelColor } : null,
      ]}
      leftSlot={<AvatarStack encounters={encounters} max={3} size={avatarSize} />}
      onPress={onPress}
      rightSlot={rightSlot}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  labelCompact: {
    flexGrow: 0,
    flexShrink: 0,
  },
});
