import { ReactNode } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useBottomSheetController } from "../../features/bottom-sheet/useBottomSheetController";
import { theme } from "../../theme";

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
  const {
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
  } = useBottomSheetController({
    footer,
    freezeKeyboardInset,
    maxHeight,
    onClose,
    visible,
  });

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
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
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
