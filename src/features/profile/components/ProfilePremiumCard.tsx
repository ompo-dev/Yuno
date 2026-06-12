import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";

interface ProfilePremiumCardProps {
  copy: AppCopy;
}

export function ProfilePremiumCard({ copy }: ProfilePremiumCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons color={theme.colors.muted} name="diamond-outline" size={18} />
        <Text style={styles.title}>{copy.profile.premiumTitle}</Text>
      </View>
      <Text style={styles.body}>{copy.profile.premiumBody}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
});
