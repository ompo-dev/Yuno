import { Platform, ViewStyle } from "react-native";

export const theme = {
  colors: {
    background: "#F6F8FA",
    backgroundDeep: "#F6F8FA",
    backgroundInk: "#EBF0F4",
    surface: "#FFFFFF",
    surfaceStrong: "#FFFFFF",
    surfaceSoft: "#F6F8FA",
    line: "#D0D7DE",
    lineStrong: "#EAECEF",
    glassGlow: "transparent",
    specular: "transparent",
    ink: "#1F2328",
    muted: "#656D76",
    blue: "#0969DA",
    blueSoft: "#EAF2FF",
    teal: "#1F6FEB",
    tealSoft: "#EAF2FF",
    green: "#1A7F37",
    greenSoft: "#EAF6EC",
    amber: "#9A6700",
    rose: "#8250DF",
    white: "#FFFFFF",
    overlay: "rgba(15, 23, 42, 0.28)",
  },
  radius: {
    xl: 24,
    lg: 20,
    md: 16,
    sm: 12,
    xs: 10,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  shadow: {
    card: Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#1F2328",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }) ?? {},
    floating: Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#1F2328",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 22,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }) ?? {},
  },
};
