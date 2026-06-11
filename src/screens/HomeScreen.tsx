import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { EncounterCard } from "../components/EncounterCard";
import { FadeInView } from "../components/FadeInView";
import { GlassCard } from "../components/GlassCard";
import { InlineRadar } from "../components/InlineRadar";
import { getHomeEncounters } from "../encounterUtils";
import { AppCopy } from "../i18n";
import { Encounter, Language } from "../types";
import { theme } from "../theme";

interface HomeScreenProps {
  copy: AppCopy;
  discoverable: boolean;
  encounters: Encounter[];
  language: Language;
  onDiscoverableChange: (value: boolean) => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function HomeScreen({
  copy,
  discoverable,
  encounters,
  language,
  onDiscoverableChange,
  onOpenEncounter,
}: HomeScreenProps) {
  const visibleEncounters = getHomeEncounters(encounters);
  const [detectedCount, setDetectedCount] = useState(
    visibleEncounters.filter((item) => item.radar).length,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView>
        <GlassCard style={styles.presenceCard}>
          <View style={styles.presenceTop}>
            <Text style={styles.presenceTitle}>{copy.home.presenceTitle}</Text>

            <Switch
              onValueChange={onDiscoverableChange}
              thumbColor="#FFFFFF"
              trackColor={{
                false: "#D0D7DE",
                true: "#2DA44E",
              }}
              value={discoverable}
            />
          </View>
        </GlassCard>
      </FadeInView>

      <FadeInView delay={40}>
        <View style={styles.radarSection}>
          <View style={styles.radarHeader}>
            <Text style={styles.radarLabel}>{copy.home.radarLive}</Text>
            <Text style={styles.radarMeta}>
              {discoverable
                ? copy.home.radarDetectedCompact(detectedCount)
                : copy.home.invisibleNearby}
            </Text>
          </View>

          <InlineRadar
            encounters={visibleEncounters}
            ghostMode={!discoverable}
            onDetectedCountChange={setDetectedCount}
            onOpenEncounter={onOpenEncounter}
          />
        </View>
      </FadeInView>

      <View style={styles.list}>
        {visibleEncounters.map((encounter, index) => (
          <FadeInView delay={index * 40} key={encounter.id}>
            <EncounterCard
              encounter={encounter}
              language={language}
              onPress={onOpenEncounter}
            />
          </FadeInView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 172,
    gap: 16,
  },
  presenceCard: {
    paddingVertical: 14,
  },
  presenceTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  presenceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  radarSection: {
    gap: 12,
  },
  radarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  radarLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  radarMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  list: {
    gap: 14,
  },
});
