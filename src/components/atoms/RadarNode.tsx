import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface RadarNodeProps {
  active?: boolean;
  content: ReactNode;
  coreStyle?: StyleProp<ViewStyle>;
  haloColor: string;
  left: number;
  nodeSize: number;
  onPress?: () => void;
  opacity?: Animated.AnimatedInterpolation<number> | Animated.Value;
  pulseScale: Animated.AnimatedInterpolation<number> | Animated.Value;
  scale?: Animated.AnimatedInterpolation<number> | Animated.Value;
  top: number;
}

export function RadarNode({
  active = true,
  content,
  coreStyle,
  haloColor,
  left,
  nodeSize,
  onPress,
  opacity,
  pulseScale,
  scale,
  top,
}: RadarNodeProps) {
  return (
    <Animated.View
      pointerEvents={active && onPress ? "auto" : "none"}
      style={[
        styles.node,
        {
          height: nodeSize,
          left,
          opacity,
          top,
          transform: scale ? [{ scale }] : undefined,
          width: nodeSize,
        },
      ]}
    >
      <Pressable
        disabled={!onPress || !active}
        onPress={onPress}
        style={[styles.nodePressable, { height: nodeSize, width: nodeSize }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.nodeHalo,
            {
              backgroundColor: haloColor,
              borderRadius: nodeSize / 2,
              height: nodeSize,
              transform: [{ scale: pulseScale }],
              width: nodeSize,
            },
          ]}
        />
        <View
          style={[
            styles.nodeCore,
            {
              borderRadius: nodeSize / 2,
              height: nodeSize,
              width: nodeSize,
            },
            coreStyle,
          ]}
        >
          {content}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  node: {
    position: "absolute",
  },
  nodePressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  nodeHalo: {
    position: "absolute",
    opacity: 0.18,
  },
  nodeCore: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
  },
});
