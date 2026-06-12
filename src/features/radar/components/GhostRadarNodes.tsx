import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Animated, StyleSheet } from "react-native";

import { RadarNode } from "../../../components/atoms";
import { theme } from "../../../theme";
import {
  CENTER,
  GHOST_ANCHORS,
  GHOST_ICON_SIZE,
  NODE_SIZE,
  RadarPresence,
} from "../model";

interface GhostRadarNodesProps {
  getVisibility: (id: string) => Animated.Value;
  nodePulseScale: Animated.AnimatedInterpolation<number> | Animated.Value;
  presence: Record<string, RadarPresence>;
}

export function GhostRadarNodes({
  getVisibility,
  nodePulseScale,
  presence,
}: GhostRadarNodesProps) {
  return GHOST_ANCHORS.map((ghost) => {
    const ghostPresence = presence[ghost.id] ?? {
      active: false,
      x: 0,
      y: 0,
    };
    const visibility = getVisibility(ghost.id);
    const nodeScale = visibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    });

    return (
      <RadarNode
        active={false}
        content={
          <MaterialCommunityIcons
            color={theme.colors.muted}
            name="ghost-outline"
            size={GHOST_ICON_SIZE}
          />
        }
        coreStyle={styles.nodeCoreGhost}
        haloColor={theme.colors.muted}
        key={ghost.id}
        left={CENTER + ghost.x * 0.82 + ghostPresence.x}
        nodeSize={NODE_SIZE}
        opacity={visibility}
        pulseScale={nodePulseScale}
        scale={nodeScale}
        top={CENTER + ghost.y * 0.82 + ghostPresence.y}
      />
    );
  });
}

const styles = StyleSheet.create({
  nodeCoreGhost: {
    backgroundColor: "rgba(248,249,251,0.96)",
    borderColor: "rgba(208,215,222,0.96)",
  },
});
