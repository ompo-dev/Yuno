import { ReactNode, useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { motion } from "../motion";

interface MotionPressableProps
  extends Omit<PressableProps, "children" | "style"> {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  fill?: boolean;
  pressOpacity?: number;
  pressScale?: number;
  pressedStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export function MotionPressable({
  children,
  contentStyle,
  fill = false,
  onPressIn,
  onPressOut,
  pressOpacity = motion.pressOpacity,
  pressScale = motion.pressScale,
  pressedStyle,
  style,
  ...rest
}: MotionPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: pressScale,
        ...motion.spring,
      }),
      Animated.timing(opacity, {
        toValue: pressOpacity,
        duration: motion.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        ...motion.spring,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    animateIn();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    animateOut();
    onPressOut?.(event);
  };

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            fill && styles.fill,
            contentStyle,
            pressed && pressedStyle,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
