export const HIDDEN_TRANSLATE_Y = 720;
export const CLOSE_DISTANCE = 56;
export const CLOSE_VELOCITY = 0.7;
export const MIN_BODY_HEIGHT = 180;
export const MIN_SHEET_RATIO = 0.5;

interface ResolveBottomSheetMetricsParams {
  activeKeyboardHeight: number;
  contentHeight: number;
  footerHeight: number;
  headerHeight: number;
  maxHeight: number;
  windowHeight: number;
}

export function resolveBottomSheetMetrics({
  activeKeyboardHeight,
  contentHeight,
  footerHeight,
  headerHeight,
  maxHeight,
  windowHeight,
}: ResolveBottomSheetMetricsParams) {
  const effectiveMaxHeight = Math.min(
    maxHeight,
    activeKeyboardHeight > 0 ? windowHeight - activeKeyboardHeight - 24 : maxHeight,
  );
  const naturalBodyHeight = Math.min(contentHeight, Math.max(MIN_BODY_HEIGHT, effectiveMaxHeight));
  const minimumSheetHeight = Math.min(
    effectiveMaxHeight,
    Math.max(windowHeight * MIN_SHEET_RATIO, headerHeight + footerHeight + naturalBodyHeight),
  );
  const availableBodyHeight = Math.max(MIN_BODY_HEIGHT, effectiveMaxHeight - headerHeight - footerHeight);
  const minimumBodyHeight = Math.max(0, minimumSheetHeight - headerHeight - footerHeight);
  const shouldScroll = contentHeight > availableBodyHeight;

  return {
    availableBodyHeight,
    effectiveMaxHeight,
    minimumBodyHeight,
    minimumSheetHeight,
    shouldScroll,
  };
}
