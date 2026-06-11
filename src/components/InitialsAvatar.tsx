import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

interface InitialsAvatarProps {
  gradient: [string, string];
  initials: string;
  imageUrl?: string;
  size?: number;
}

export const InitialsAvatar = memo(function InitialsAvatar({
  gradient,
  initials,
  imageUrl,
  size = 54,
}: InitialsAvatarProps) {
  if (imageUrl) {
    return (
      <View
        style={[
          styles.imageWrap,
          {
            borderRadius: size / 2,
            height: size,
            width: size,
          },
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradient}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <View style={styles.innerRing}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  imageWrap: {
    overflow: "hidden",
    borderWidth: 0.33,
    borderColor: theme.colors.line,
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  initials: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
});
