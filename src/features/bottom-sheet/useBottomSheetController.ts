import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  useWindowDimensions,
} from "react-native";

import { motion } from "../../motion";
import {
  CLOSE_DISTANCE,
  CLOSE_VELOCITY,
  HIDDEN_TRANSLATE_Y,
  resolveBottomSheetMetrics,
} from "./model";
import { useBottomSheetDrag } from "./useBottomSheetDrag";
import { useBottomSheetKeyboardHeight } from "./useBottomSheetKeyboardHeight";

interface UseBottomSheetControllerParams {
  footer?: React.ReactNode;
  freezeKeyboardInset?: boolean;
  maxHeight?: number | `${number}%`;
  onClose: () => void;
  visible: boolean;
}

export function useBottomSheetController({
  footer,
  freezeKeyboardInset = false,
  maxHeight = "75%",
  onClose,
  visible,
}: UseBottomSheetControllerParams) {
  const { height: windowHeight } = useWindowDimensions();
  const [shouldRender, setShouldRender] = useState(visible);
  const [contentHeight, setContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(HIDDEN_TRANSLATE_Y)).current;
  const dragDistanceRef = useRef(0);
  const isHeaderDraggingRef = useRef(false);
  const keyboardHeight = useBottomSheetKeyboardHeight(visible);
  const activeKeyboardHeight = freezeKeyboardInset ? 0 : keyboardHeight;

  const resolvedMaxHeight =
    typeof maxHeight === "string"
      ? (windowHeight * Number.parseFloat(maxHeight)) / 100
      : maxHeight;
  const {
    availableBodyHeight,
    effectiveMaxHeight,
    minimumBodyHeight,
    minimumSheetHeight,
    shouldScroll,
  } = useMemo(
    () =>
      resolveBottomSheetMetrics({
        activeKeyboardHeight,
        contentHeight,
        footerHeight,
        headerHeight,
        maxHeight: resolvedMaxHeight,
        windowHeight,
      }),
    [activeKeyboardHeight, contentHeight, footerHeight, headerHeight, resolvedMaxHeight, windowHeight],
  );

  const settleSheet = useMemo(
    () => (distance: number, velocity = 0) => {
      dragDistanceRef.current = 0;

      if (distance > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) {
        onClose();
        return;
      }

      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        mass: 0.9,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    },
    [onClose, translateY],
  );

  const animateOpen = useMemo(
    () => () => {
      translateY.setValue(HIDDEN_TRANSLATE_Y);
      backdropOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: motion.duration.base,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          mass: 0.9,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [backdropOpacity, translateY],
  );

  const animateClose = useMemo(
    () => (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: motion.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: HIDDEN_TRANSLATE_Y,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => callback?.());
    },
    [backdropOpacity, translateY],
  );

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    if (visible) {
      animateOpen();
      return;
    }

    animateClose(() => setShouldRender(false));
  }, [animateClose, animateOpen, shouldRender, visible]);

  useEffect(() => {
    if (!footer) {
      setFooterHeight(0);
    }
  }, [footer]);
  const { handleScroll, handleScrollEndDrag, panResponder } = useBottomSheetDrag({
    dragDistanceRef,
    isHeaderDraggingRef,
    settleSheet,
    translateY,
  });

  return {
    activeKeyboardHeight,
    availableBodyHeight,
    backdropOpacity,
    effectiveMaxHeight,
    handleScroll,
    handleScrollEndDrag,
    minimumBodyHeight,
    minimumSheetHeight,
    panResponder,
    setContentHeight,
    setFooterHeight,
    setHeaderHeight,
    shouldRender,
    shouldScroll,
    translateY,
  };
}
