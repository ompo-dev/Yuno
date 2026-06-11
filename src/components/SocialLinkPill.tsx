import { memo } from "react";
import { Linking, StyleSheet } from "react-native";

import {
  buildSocialUrl,
  formatSocialValue,
  socialProviderConfig,
} from "../socialLinks";
import { SocialLink } from "../types";
import { InfoChip } from "./InfoChip";

interface SocialLinkPillProps {
  link: SocialLink;
  onPress?: () => void;
}

export const SocialLinkPill = memo(function SocialLinkPill({
  link,
  onPress,
}: SocialLinkPillProps) {
  const config = socialProviderConfig[link.provider];
  const url = buildSocialUrl(link.provider, link.value);
  const valueLabel = formatSocialValue(link.provider, link.value);

  if (!valueLabel) {
    return null;
  }

  return (
    <InfoChip
      icon={config.icon}
      iconColor={config.iconColor}
      iconSize={14}
      label={valueLabel}
      labelStyle={[styles.value, { color: config.textColor }]}
      onPress={
        onPress
          ? onPress
          : () => {
              if (url) {
                Linking.openURL(url);
              }
            }
      }
      style={[
        styles.pill,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  pill: {
    maxWidth: "100%",
  },
  value: {
    fontWeight: "600",
  },
});
