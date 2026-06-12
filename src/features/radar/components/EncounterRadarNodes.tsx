import { Animated, Image, StyleSheet, Text } from "react-native";

import { RadarNode } from "../../../components/atoms";
import { theme } from "../../../theme";
import { Encounter } from "../../../types";
import { CENTER, NODE_SIZE, RadarPresence } from "../model";

interface EncounterRadarNodesProps {
  encounters: Encounter[];
  getVisibility: (id: string) => Animated.Value;
  nodePulseScale: Animated.AnimatedInterpolation<number> | Animated.Value;
  onOpenEncounter: (encounter: Encounter) => void;
  presence: Record<string, RadarPresence>;
}

export function EncounterRadarNodes({
  encounters,
  getVisibility,
  nodePulseScale,
  onOpenEncounter,
  presence,
}: EncounterRadarNodesProps) {
  return encounters.map((encounter) => {
    if (!encounter.radar) {
      return null;
    }

    const pointPresence = presence[encounter.id] ?? {
      active: false,
      x: 0,
      y: 0,
    };
    const visibility = getVisibility(encounter.id);
    const nodeScale = visibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    });

    return (
      <RadarNode
        active={pointPresence.active}
        content={
          encounter.avatarUrl ? (
            <Image source={{ uri: encounter.avatarUrl }} style={styles.nodeAvatar} />
          ) : (
            <Text style={styles.nodeLabel}>{encounter.initials}</Text>
          )
        }
        coreStyle={{
          backgroundColor: encounter.radar.color,
          borderColor: theme.colors.white,
        }}
        haloColor={encounter.radar.color}
        key={encounter.id}
        left={CENTER + encounter.radar.x * 0.78 + pointPresence.x}
        nodeSize={NODE_SIZE}
        onPress={() => onOpenEncounter(encounter)}
        opacity={visibility}
        pulseScale={nodePulseScale}
        scale={nodeScale}
        top={CENTER + encounter.radar.y * 0.78 + pointPresence.y}
      />
    );
  });
}

const styles = StyleSheet.create({
  nodeAvatar: {
    width: "100%",
    height: "100%",
  },
  nodeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
