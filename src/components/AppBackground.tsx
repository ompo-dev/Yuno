import { StyleSheet, View } from "react-native";

import { theme } from "../theme";

export function AppBackground() {
  return (
    <View pointerEvents="none" style={styles.background} />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
  },
});
