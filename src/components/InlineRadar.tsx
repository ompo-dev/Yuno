import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Encounter } from "../types";
import { theme } from "../theme";
import { RadarNode } from "./RadarNode";

interface InlineRadarProps {
  encounters: Encounter[];
  ghostMode?: boolean;
  onDetectedCountChange?: (count: number) => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

interface RadarPresence {
  active: boolean;
  x: number;
  y: number;
}

const RADAR_SIZE = 232;
const NODE_SIZE = 38;
const GHOST_ICON_SIZE = 20;
const CENTER = RADAR_SIZE / 2 - NODE_SIZE / 2;
const GHOST_IDS = ["ghost-1", "ghost-2", "ghost-3", "ghost-4", "ghost-5"];

export const InlineRadar = memo(function InlineRadar({
  encounters,
  ghostMode = false,
  onDetectedCountChange,
  onOpenEncounter,
}: InlineRadarProps) {
  const points = useMemo(
    () => encounters.filter((encounter) => encounter.radar).slice(0, 4),
    [encounters],
  );
  const pointsSignature = useMemo(
    () =>
      points
        .map((point) =>
          point.radar
            ? `${point.id}:${point.radar.x}:${point.radar.y}:${point.radar.color}`
            : point.id,
        )
        .join("|"),
    [points],
  );
  const pointIds = useMemo(() => points.map((point) => point.id), [pointsSignature]);
  const [presence, setPresence] = useState<Record<string, RadarPresence>>({});
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const nodePulse = useRef(new Animated.Value(0)).current;
  const visibilityRefs = useRef<Record<string, Animated.Value>>({});

  [...points.map((point) => point.id), ...GHOST_IDS].forEach((id) => {
    if (!visibilityRefs.current[id]) {
      visibilityRefs.current[id] = new Animated.Value(0);
    }
  });

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    const nodeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(nodePulse, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(nodePulse, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    sweepLoop.start();
    pulseLoop.start();
    nodeLoop.start();

    return () => {
      sweepLoop.stop();
      pulseLoop.stop();
      nodeLoop.stop();
    };
  }, [nodePulse, pulse, sweep]);

  useEffect(() => {
    const sourceIds = ghostMode ? GHOST_IDS : pointIds;

    const updatePresence = () => {
      if (!sourceIds.length) {
        onDetectedCountChange?.(0);
        return;
      }

      const fallbackIndex = Math.floor(Math.random() * sourceIds.length);
      const nextPresence: Record<string, RadarPresence> = {};
      let activeCount = 0;

      sourceIds.forEach((id, index) => {
        const shouldStayActive = Math.random() > (ghostMode ? 0.18 : 0.35) || index === fallbackIndex;
        const nextActive =
          activeCount === 0 && index === sourceIds.length - 1 ? true : shouldStayActive;

        if (nextActive && !ghostMode) {
          activeCount += 1;
        }

        nextPresence[id] = {
          active: nextActive,
          x: (Math.random() - 0.5) * (ghostMode ? 18 : 10),
          y: (Math.random() - 0.5) * (ghostMode ? 18 : 10),
        };

        Animated.spring(visibilityRefs.current[id], {
          toValue: nextActive ? 1 : 0,
          damping: 18,
          mass: 0.8,
          stiffness: 180,
          useNativeDriver: true,
        }).start();
      });

      setPresence(nextPresence);
      onDetectedCountChange?.(ghostMode ? 0 : activeCount);
    };

    updatePresence();
    const interval = setInterval(updatePresence, ghostMode ? 1400 : 1800);

    return () => clearInterval(interval);
  }, [ghostMode, onDetectedCountChange, pointIds, pointsSignature]);

  const rotation = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.62, 1],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [ghostMode ? 0.12 : 0.22, 0],
  });
  const nodePulseScale = nodePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, ghostMode ? 1.06 : 1.1],
  });

  const ghostAnchors = [
    { id: "ghost-1", x: -78, y: -58 },
    { id: "ghost-2", x: 64, y: -44 },
    { id: "ghost-3", x: -82, y: 26 },
    { id: "ghost-4", x: 34, y: 58 },
    { id: "ghost-5", x: 2, y: -80 },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.stage, ghostMode && styles.stageGhost]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wave,
            {
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />

        <View style={[styles.ring, styles.ringOuter, ghostMode && styles.ringGhost]} />
        <View style={[styles.ring, styles.ringMiddle, ghostMode && styles.ringGhost]} />
        <View style={[styles.ring, styles.ringInner, ghostMode && styles.ringGhost]} />
        <View style={[styles.crosshairVertical, ghostMode && styles.crosshairGhost]} />
        <View style={[styles.crosshairHorizontal, ghostMode && styles.crosshairGhost]} />

        <Animated.View
          pointerEvents="none"
          style={[styles.sweepWrap, { transform: [{ rotate: rotation }] }]}
        >
          <LinearGradient
            colors={
              ghostMode
                ? ["rgba(101,109,118,0.14)", "rgba(101,109,118,0.00)"]
                : ["rgba(31,35,40,0.20)", "rgba(31,35,40,0.00)"]
            }
            end={{ x: 0.5, y: 0 }}
            start={{ x: 0.5, y: 1 }}
            style={styles.sweepBeam}
          />
          <View style={[styles.sweepDot, ghostMode && styles.sweepDotGhost]} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.centerHalo,
            {
              backgroundColor: ghostMode ? "rgba(101,109,118,0.12)" : "rgba(31,35,40,0.12)",
              transform: [{ scale: nodePulseScale }],
            },
          ]}
        />
        <View style={[styles.centerDot, ghostMode && styles.centerDotGhost]} />

        {ghostMode
          ? ghostAnchors.map((ghost) => {
              const ghostPresence = presence[ghost.id] ?? {
                active: false,
                x: 0,
                y: 0,
              };
              const visibility = visibilityRefs.current[ghost.id];
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
            })
          : points.map((encounter) => {
              if (!encounter.radar) {
                return null;
              }

              const pointPresence = presence[encounter.id] ?? {
                active: false,
                x: 0,
                y: 0,
              };
              const visibility = visibilityRefs.current[encounter.id];
              const nodeScale = visibility.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1],
              });

              return (
                <RadarNode
                  active={pointPresence.active}
                  content={
                    encounter.avatarUrl ? (
                      <Image
                        source={{ uri: encounter.avatarUrl }}
                        style={styles.nodeAvatar}
                      />
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
            })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  stage: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(252,252,253,0.82)",
  },
  stageGhost: {
    backgroundColor: "rgba(248,249,251,0.88)",
  },
  wave: {
    position: "absolute",
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(31,35,40,0.20)",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  ringGhost: {
    borderColor: "rgba(208,215,222,0.9)",
  },
  ringOuter: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
  },
  ringMiddle: {
    width: 162,
    height: 162,
  },
  ringInner: {
    width: 96,
    height: 96,
  },
  crosshairVertical: {
    position: "absolute",
    width: 1,
    height: RADAR_SIZE,
    backgroundColor: theme.colors.line,
  },
  crosshairHorizontal: {
    position: "absolute",
    width: RADAR_SIZE,
    height: 1,
    backgroundColor: theme.colors.line,
  },
  crosshairGhost: {
    backgroundColor: "rgba(208,215,222,0.92)",
  },
  sweepWrap: {
    position: "absolute",
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sweepBeam: {
    width: 2,
    height: RADAR_SIZE / 2 - 10,
    borderRadius: 999,
    marginTop: 10,
  },
  sweepDot: {
    marginTop: -6,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
  },
  sweepDotGhost: {
    backgroundColor: theme.colors.muted,
  },
  centerHalo: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 999,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
  },
  centerDotGhost: {
    backgroundColor: theme.colors.muted,
  },
  nodeCoreGhost: {
    backgroundColor: "rgba(248,249,251,0.96)",
    borderColor: "rgba(208,215,222,0.96)",
  },
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
