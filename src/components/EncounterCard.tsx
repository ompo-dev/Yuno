import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../i18n";
import { Encounter, Language } from "../types";
import { theme } from "../theme";
import { InfoChip } from "./InfoChip";
import { InitialsAvatar } from "./InitialsAvatar";
import { MotionPressable } from "./MotionPressable";

interface EncounterCardProps {
  encounter: Encounter;
  language: Language;
  onPress: (encounter: Encounter) => void;
}

export const EncounterCard = memo(function EncounterCard({
  encounter,
  language,
  onPress,
}: EncounterCardProps) {
  const eventTone =
    encounter.eventTone === "green"
      ? "green"
      : encounter.eventTone === "purple"
        ? "purple"
        : "blue";

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <MotionPressable
          contentStyle={styles.topSection}
          onPress={() => onPress(encounter)}
          pressScale={0.988}
        >
          <InitialsAvatar
            gradient={encounter.gradient}
            imageUrl={encounter.avatarUrl}
            initials={encounter.initials}
            size={58}
          />

          <View style={styles.rightColumn}>
            <View style={styles.titleRow}>
              <View style={styles.nameWrap}>
                <Text style={styles.name}>{encounter.name}</Text>
                {encounter.verified ? (
                  <Ionicons
                    color={theme.colors.blue}
                    name="checkmark-circle"
                    size={14}
                  />
                ) : null}
              </View>

              <Ionicons
                color={theme.colors.muted}
                name="chevron-forward"
                size={16}
              />
            </View>

            <Text style={styles.roleLine}>
              {resolveLocalizedText(encounter.role, language)} {encounter.company}
            </Text>

            <Text numberOfLines={2} style={styles.description}>
              {resolveLocalizedText(encounter.context, language)}
            </Text>
          </View>
        </MotionPressable>

        <ScrollView
          contentContainerStyle={styles.tagsRow}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          <InfoChip
            icon="people-outline"
            label={resolveLocalizedText(encounter.event, language)}
            tone={eventTone}
          />
          <InfoChip
            icon={encounter.interactionIcon ?? "chatbubble-ellipses-outline"}
            label={resolveLocalizedText(
              encounter.interactionLabel ?? encounter.context,
              language,
            )}
          />
          <InfoChip
            icon={
              encounter.connected ? "checkmark-circle-outline" : "ellipse-outline"
            }
            label={
              encounter.connected
                ? language === "pt-BR"
                  ? "Conectado"
                  : "Connected"
                : language === "pt-BR"
                  ? encounter.followUp === "warm"
                    ? "Quente"
                    : encounter.followUp === "starred"
                      ? "Prioridade"
                      : "Pendente"
                  : encounter.followUp === "warm"
                    ? "Warm"
                    : encounter.followUp === "starred"
                      ? "Starred"
                      : "Pending"
            }
            tone={encounter.connected ? "green" : "neutral"}
          />
        </ScrollView>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.lg,
  },
  card: {
    gap: 14,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadow.card,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  rightColumn: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  nameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  roleLine: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.ink,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 4,
  },
});
