import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { resolveLocalizedText } from "../i18n";
import { EventSummary, Language } from "../types";
import { theme } from "../theme";
import { RadarNode } from "./RadarNode";

interface EventRadarProps {
  events: EventSummary[];
  language: Language;
  onOpenEvent: (event: EventSummary) => void;
}

const RADAR_SIZE = 232;
const NODE_SIZE = 38;
const CENTER = RADAR_SIZE / 2 - NODE_SIZE / 2;

function getProgressBorder(progress: number) {
  if (progress <= 30) {
    return "#1A7F37";
  }

  if (progress <= 70) {
    return "#BF8700";
  }

  return "#CF222E";
}

function getToneColors(tone: EventSummary["tone"]) {
  if (tone === "green") {
    return {
      background: theme.colors.greenSoft,
      text: theme.colors.green,
    };
  }

  if (tone === "purple") {
    return {
      background: "#F3EEFF",
      text: theme.colors.rose,
    };
  }

  return {
    background: theme.colors.blueSoft,
    text: theme.colors.blue,
  };
}

function getEventAbbreviation(event: EventSummary, language: Language) {
  const words = resolveLocalizedText(event.name, language)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export const EventRadar = memo(function EventRadar({
  events,
  language,
  onOpenEvent,
}: EventRadarProps) {
  const activeEvents = useMemo(
    () => events.filter((event) => event.status !== "recent"),
    [events],
  );
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const nodePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 3400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1700,
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
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(nodePulse, {
          toValue: 0,
          duration: 1000,
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
    outputRange: [0.16, 0],
  });
  const nodePulseScale = nodePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
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

        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMiddle]} />
        <View style={[styles.ring, styles.ringInner]} />
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairHorizontal} />

        <Animated.View
          pointerEvents="none"
          style={[styles.sweepWrap, { transform: [{ rotate: rotation }] }]}
        >
          <LinearGradient
            colors={["rgba(31,35,40,0.20)", "rgba(31,35,40,0.00)"]}
            end={{ x: 0.5, y: 0 }}
            start={{ x: 0.5, y: 1 }}
            style={styles.sweepBeam}
          />
          <View style={styles.sweepDot} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.centerHalo,
            {
              transform: [{ scale: nodePulseScale }],
            },
          ]}
        />
        <View style={styles.centerDot} />

        {activeEvents.map((event) => {
          const colors = getToneColors(event.tone);
          const borderColor = getProgressBorder(event.progress);
          const label = getEventAbbreviation(event, language);

          return (
            <RadarNode
              content={<Text style={[styles.nodeLabel, { color: colors.text }]}>{label}</Text>}
              coreStyle={{
                backgroundColor: colors.background,
                borderColor,
              }}
              haloColor={borderColor}
              key={event.id}
              left={CENTER + event.radar.x * 0.78}
              nodeSize={NODE_SIZE}
              onPress={() => onOpenEvent(event)}
              pulseScale={nodePulseScale}
              top={CENTER + event.radar.y * 0.78}
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
  centerHalo: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "rgba(31,35,40,0.12)",
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
  },
  nodeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
