import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { motion } from "../motion";
import { theme } from "../theme";

interface BottomSheetModalProps {
  bodyStyle?: StyleProp<ViewStyle>;
  bottomInset: number;
  children: ReactNode;
  footer?: ReactNode;
  freezeKeyboardInset?: boolean;
  maxHeight?: number | `${number}%`;
  onClose: () => void;
  overlayContent?: ReactNode;
  visible: boolean;
}

const HIDDEN_TRANSLATE_Y = 720;

export function BottomSheetModal({
  bodyStyle,
  bottomInset,
  children,
  footer,
  freezeKeyboardInset = false,
  maxHeight = "75%",
  onClose,
  overlayContent,
  visible,
}: BottomSheetModalProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [shouldRender, setShouldRender] = useState(visible);
  const [contentHeight, setContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(HIDDEN_TRANSLATE_Y)).current;
  const dragDistanceRef = useRef(0);
  const isHeaderDraggingRef = useRef(false);
  const activeKeyboardHeight = freezeKeyboardInset ? 0 : keyboardHeight;
  const resolvedMaxHeight =
    typeof maxHeight === "string"
      ? (windowHeight * Number.parseFloat(maxHeight)) / 100
      : maxHeight;
  const effectiveMaxHeight = Math.min(
    resolvedMaxHeight,
    activeKeyboardHeight > 0
      ? windowHeight - activeKeyboardHeight - 24
      : resolvedMaxHeight,
  );
  const naturalBodyHeight = Math.min(contentHeight, Math.max(180, effectiveMaxHeight));
  const minimumSheetHeight = Math.min(
    effectiveMaxHeight,
    Math.max(windowHeight * 0.5, headerHeight + footerHeight + naturalBodyHeight),
  );
  const availableBodyHeight = Math.max(
    180,
    effectiveMaxHeight - headerHeight - footerHeight,
  );
  const minimumBodyHeight = Math.max(
    0,
    minimumSheetHeight - headerHeight - footerHeight,
  );
  const shouldScroll = contentHeight > availableBodyHeight;

  const settleSheet = (distance: number, velocity = 0) => {
    dragDistanceRef.current = 0;

    if (distance > 72 || velocity > 0.85) {
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
  };

  const animateOpen = () => {
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
  };

  const animateClose = (callback?: () => void) => {
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
  };

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
  }, [backdropOpacity, shouldRender, translateY, visible]);

  useEffect(() => {
    if (!visible) {
      setScrollOffset(0);
      setKeyboardHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!footer) {
      setFooterHeight(0);
    }
  }, [footer]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 2 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderGrant: () => {
          isHeaderDraggingRef.current = true;
          dragDistanceRef.current = 0;
        },
        onPanResponderMove: (_, gestureState) => {
          const nextDistance = Math.max(0, gestureState.dy);
          dragDistanceRef.current = nextDistance;
          translateY.setValue(nextDistance);
        },
        onPanResponderRelease: (_, gestureState) => {
          isHeaderDraggingRef.current = false;
          settleSheet(Math.max(0, gestureState.dy), gestureState.vy);
        },
        onPanResponderTerminate: () => {
          isHeaderDraggingRef.current = false;
          settleSheet(dragDistanceRef.current);
        },
      }),
    [onClose, translateY],
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible>
      <View style={styles.overlay}>
        <Animated.View
          pointerEvents="none"
          style={[styles.backdropFill, { opacity: backdropOpacity }]}
        />
        <Pressable onPress={onClose} style={styles.backdrop} />

        <Animated.View
          style={[
            styles.sheet,
            {
              marginBottom: activeKeyboardHeight,
              maxHeight: effectiveMaxHeight,
              minHeight: minimumSheetHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            {...panResponder.panHandlers}
            onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
            style={styles.header}
          >
            <View style={styles.dragTouch}>
              <View style={styles.dragHandle} />
            </View>
          </View>

          <ScrollView
            alwaysBounceVertical
            automaticallyAdjustKeyboardInsets={
              !freezeKeyboardInset && activeKeyboardHeight > 0
            }
            bounces
            directionalLockEnabled
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={(_, height) => setContentHeight(height)}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              setScrollOffset(Math.max(0, offsetY));

              if (!isHeaderDraggingRef.current && offsetY < 0) {
                const pullDistance = Math.min(180, Math.abs(offsetY) * 1.35);
                dragDistanceRef.current = pullDistance;
                translateY.setValue(pullDistance);
              }
            }}
            onScrollEndDrag={(event) => {
              if (isHeaderDraggingRef.current) {
                return;
              }

              const offsetY = event.nativeEvent.contentOffset.y;
              if (offsetY < 0) {
                settleSheet(Math.min(180, Math.abs(offsetY) * 1.35));
                return;
              }

              if (dragDistanceRef.current > 0) {
                settleSheet(dragDistanceRef.current);
              }
            }}
            scrollEnabled
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={[
              {
                minHeight: minimumBodyHeight,
              },
              shouldScroll ? { maxHeight: availableBodyHeight } : undefined,
            ]}
            contentContainerStyle={[styles.body, bodyStyle]}
          >
            {children}
          </ScrollView>

          {footer ? (
            <View
              onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
              style={[
                styles.footer,
                { paddingBottom: Math.max(18, Math.round(bottomInset * 0.55)) },
              ]}
            >
              {footer}
            </View>
          ) : null}
        </Animated.View>

        {overlayContent}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.colors.line,
    ...theme.shadow.floating,
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 6,
  },
  dragTouch: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.line,
  },
  body: {
    gap: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    backgroundColor: "rgba(246,248,250,0.92)",
    paddingHorizontal: 22,
    paddingTop: 14,
  },
});
