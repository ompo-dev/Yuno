import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Encounter } from "../../types";
import { theme } from "../../theme";
import { InitialsAvatar } from "../atoms/InitialsAvatar";

interface AvatarStackProps {
  encounters: Encounter[];
  max?: number;
  size?: number;
}

export const AvatarStack = memo(function AvatarStack({
  encounters,
  max = 4,
  size = 28,
}: AvatarStackProps) {
  const visible = encounters.slice(0, max);
  const remaining = Math.max(0, encounters.length - visible.length);
  const borderWidth = 0.33;
  const overlapOffset = Math.round(size * 0.24);
  const moreLabelSize = Math.max(
    7,
    Math.min(10, Number((size * 0.46).toFixed(1))),
  );

  return (
    <View style={[styles.row, { height: size }]}>
      {visible.map((encounter, index) => (
        <View
          key={encounter.id}
          style={[
            styles.avatarWrap,
            {
              borderWidth,
              marginLeft: index === 0 ? 0 : -overlapOffset,
              zIndex: visible.length - index,
            },
          ]}
        >
          <InitialsAvatar
            gradient={encounter.gradient}
            imageUrl={encounter.avatarUrl}
            initials={encounter.initials}
            size={size}
          />
        </View>
      ))}

      {remaining ? (
        <View
          style={[
            styles.moreBubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -overlapOffset,
            },
          ]}
        >
          <Text style={[styles.moreLabel, { fontSize: moreLabelSize }]}>
            +{remaining}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    borderRadius: 999,
    borderColor: theme.colors.line,
    overflow: "hidden",
  },
  moreBubble: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 0.33,
    borderColor: theme.colors.line,
  },
  moreLabel: {
    fontWeight: "700",
    lineHeight: 11,
    color: theme.colors.muted,
  },
});
