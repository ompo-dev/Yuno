import { LayoutAnimation, Platform, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const motion = {
  duration: {
    fast: 140,
    base: 200,
    slow: 260,
  },
  distance: {
    subtle: 10,
    medium: 16,
  },
  pressScale: 0.975,
  pressOpacity: 0.96,
  spring: {
    damping: 18,
    mass: 0.8,
    stiffness: 260,
    useNativeDriver: true as const,
  },
};

export function animateLayoutTransition() {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      motion.duration.base,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
}
