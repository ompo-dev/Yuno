import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { motion } from "../../motion";
import { theme } from "../../theme";
import { MotionPressable } from "../atoms/MotionPressable";

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const SHELL_PADDING = 4;
const SEGMENT_GAP = 6;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const [shellWidth, setShellWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  );
  const segmentWidth = useMemo(() => {
    if (!shellWidth || !options.length) {
      return 0;
    }

    const innerWidth =
      shellWidth - SHELL_PADDING * 2 - SEGMENT_GAP * (options.length - 1);

    return innerWidth / options.length;
  }, [options.length, shellWidth]);

  useEffect(() => {
    const nextX = SHELL_PADDING + selectedIndex * (segmentWidth + SEGMENT_GAP);

    Animated.spring(translateX, {
      toValue: Number.isFinite(nextX) ? nextX : 0,
      ...motion.spring,
    }).start();
  }, [segmentWidth, selectedIndex, translateX]);

  return (
    <View
      onLayout={(event) => setShellWidth(event.nativeEvent.layout.width)}
      style={styles.shell}
    >
      {segmentWidth ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.segmentIndicator,
            {
              transform: [{ translateX }],
              width: segmentWidth,
            },
          ]}
        />
      ) : null}

      {options.map((option) => {
        const selected = option.value === value;

        return (
          <MotionPressable
            contentStyle={styles.segment}
            key={option.value}
            onPress={() => onChange(option.value)}
            pressScale={0.98}
            style={styles.segmentTouch}
          >
            <Text
              style={[styles.segmentLabel, selected && styles.segmentLabelActive]}
            >
              {option.label}
            </Text>
          </MotionPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: "row",
    gap: SEGMENT_GAP,
    padding: SHELL_PADDING,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
  },
  segmentIndicator: {
    position: "absolute",
    top: SHELL_PADDING,
    bottom: SHELL_PADDING,
    left: 0,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.lineStrong,
  },
  segmentTouch: {
    flex: 1,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    minHeight: 36,
    paddingHorizontal: 12,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.muted,
  },
  segmentLabelActive: {
    color: theme.colors.ink,
    fontWeight: "600",
  },
});
