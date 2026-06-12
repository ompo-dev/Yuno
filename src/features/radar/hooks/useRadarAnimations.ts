import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseRadarAnimationsOptions {
  nodeDuration?: number;
  pulseDuration?: number;
  pulseOpacityRange?: [number, number];
  pulseScaleRange?: [number, number];
  rotationDuration?: number;
  nodeScaleRange?: [number, number];
}

export function useRadarAnimations({
  nodeDuration = 1000,
  pulseDuration = 1700,
  pulseOpacityRange = [0.16, 0],
  pulseScaleRange = [0.62, 1],
  rotationDuration = 3400,
  nodeScaleRange = [1, 1.1],
}: UseRadarAnimationsOptions = {}) {
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const nodePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: rotationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseDuration,
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
          duration: nodeDuration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(nodePulse, {
          toValue: 0,
          duration: nodeDuration,
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
  }, [nodeDuration, nodePulse, pulse, pulseDuration, rotationDuration, sweep]);

  const rotation = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: pulseScaleRange,
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: pulseOpacityRange,
  });
  const nodePulseScale = nodePulse.interpolate({
    inputRange: [0, 1],
    outputRange: nodeScaleRange,
  });

  return {
    nodePulseScale,
    pulseOpacity,
    pulseScale,
    rotation,
  };
}
