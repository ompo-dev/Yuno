import { ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../../theme";
import { RADAR_SIZE } from "../model";

interface RadarFrameProps {
  children: ReactNode;
  ghostMode?: boolean;
  nodePulseScale: Animated.AnimatedInterpolation<string | number>;
  pulseOpacity: Animated.AnimatedInterpolation<string | number>;
  pulseScale: Animated.AnimatedInterpolation<string | number>;
  rotation: Animated.AnimatedInterpolation<string | number>;
}

export function RadarFrame({
  children,
  ghostMode = false,
  nodePulseScale,
  pulseOpacity,
  pulseScale,
  rotation,
}: RadarFrameProps) {
  return (
    <View style={styles.root}>
      <View style={[styles.stage, ghostMode && styles.stageGhost]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wave,
            ghostMode && styles.waveGhost,
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
            ghostMode && styles.centerHaloGhost,
            {
              transform: [{ scale: nodePulseScale }],
            },
          ]}
        />
        <View style={[styles.centerDot, ghostMode && styles.centerDotGhost]} />

        {children}
      </View>
    </View>
  );
}

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
  waveGhost: {
    borderColor: "rgba(101,109,118,0.18)",
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
    backgroundColor: "rgba(31,35,40,0.12)",
  },
  centerHaloGhost: {
    backgroundColor: "rgba(101,109,118,0.12)",
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
});
