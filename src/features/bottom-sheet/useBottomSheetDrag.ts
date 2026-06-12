import { useMemo } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
} from "react-native";

interface UseBottomSheetDragParams {
  dragDistanceRef: React.MutableRefObject<number>;
  isHeaderDraggingRef: React.MutableRefObject<boolean>;
  settleSheet: (distance: number, velocity?: number) => void;
  translateY: Animated.Value;
}

export function useBottomSheetDrag({
  dragDistanceRef,
  isHeaderDraggingRef,
  settleSheet,
  translateY,
}: UseBottomSheetDragParams) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 3 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
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
    [dragDistanceRef, isHeaderDraggingRef, settleSheet, translateY],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (!isHeaderDraggingRef.current && offsetY < 0) {
      const pullDistance = Math.min(180, Math.abs(offsetY) * 1.35);
      dragDistanceRef.current = pullDistance;
      translateY.setValue(pullDistance);
    }
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
  };

  return {
    handleScroll,
    handleScrollEndDrag,
    panResponder,
  };
}
