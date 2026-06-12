import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "../../../../theme";

export function ArtworkFrame({ children }: { children: ReactNode }) {
  return (
    <View style={styles.frame}>
      <View style={[styles.glow, styles.glowBlue]} />
      <View style={[styles.glow, styles.glowGreen]} />
      <View style={[styles.glow, styles.glowNeutral]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minHeight: 316,
    borderRadius: 30,
    padding: 12,
    overflow: "hidden",
    backgroundColor: "#FCFDFE",
    borderWidth: 1,
    borderColor: theme.colors.lineStrong,
    ...theme.shadow.card,
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.9,
  },
  glowBlue: {
    top: -32,
    right: -18,
    width: 156,
    height: 156,
    backgroundColor: "#EAF2FF",
  },
  glowGreen: {
    bottom: 24,
    left: -28,
    width: 132,
    height: 132,
    backgroundColor: "#EAF6EC",
  },
  glowNeutral: {
    bottom: -40,
    right: 30,
    width: 146,
    height: 146,
    backgroundColor: "#F4F6F8",
  },
});
