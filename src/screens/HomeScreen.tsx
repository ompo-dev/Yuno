import { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { getHomeEncounters } from "../encounterUtils";
import { useAppShellContext } from "../features/app-shell/AppShellContext";
import { HomeEncounterFeed, HomePresenceCard, HomeRadarSection } from "../features/home/components";
export function HomeScreen() {
  const {
    actions,
    copy,
    language,
    openEncounterSheet,
    state: {
      encounters,
      isDiscoverable,
    },
  } = useAppShellContext();
  const visibleEncounters = useMemo(
    () => getHomeEncounters(encounters),
    [encounters],
  );
  const [detectedCount, setDetectedCount] = useState(
    visibleEncounters.filter((item) => item.radar).length,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HomePresenceCard
        copy={copy}
        discoverable={isDiscoverable}
        onDiscoverableChange={actions.changeDiscoverable}
      />

      <HomeRadarSection
        copy={copy}
        detectedCount={detectedCount}
        discoverable={isDiscoverable}
        encounters={visibleEncounters}
        onDetectedCountChange={setDetectedCount}
        onOpenEncounter={openEncounterSheet}
      />

      <HomeEncounterFeed
        encounters={visibleEncounters}
        language={language}
        onOpenEncounter={openEncounterSheet}
      />
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
});
