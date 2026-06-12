import { Animated, StyleSheet, Text } from "react-native";

import { RadarNode } from "../../../components/atoms";
import { EventSummary, Language } from "../../../types";
import {
  CENTER,
  getEventAbbreviation,
  getEventProgressBorder,
  getEventToneColors,
  NODE_SIZE,
} from "../model";

interface EventRadarNodesProps {
  events: EventSummary[];
  language: Language;
  nodePulseScale: Animated.AnimatedInterpolation<number> | Animated.Value;
  onOpenEvent: (event: EventSummary) => void;
}

export function EventRadarNodes({
  events,
  language,
  nodePulseScale,
  onOpenEvent,
}: EventRadarNodesProps) {
  return events.map((event) => {
    const colors = getEventToneColors(event.tone);
    const borderColor = getEventProgressBorder(event.progress);

    return (
      <RadarNode
        content={
          <Text style={[styles.nodeLabel, { color: colors.text }]}>
            {getEventAbbreviation(event, language)}
          </Text>
        }
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
  });
}

const styles = StyleSheet.create({
  nodeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
