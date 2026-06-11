import { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";

import { motion } from "../motion";

interface ScreenTransitionProps {
  children: ReactNode;
  distance?: number;
  style?: StyleProp<ViewStyle>;
  transitionKey: string | number;
}

export function ScreenTransition({
  children,
  distance = motion.distance.medium,
  style,
  transitionKey,
}: ScreenTransitionProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(distance);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.base,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.base,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [distance, opacity, transitionKey, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};
