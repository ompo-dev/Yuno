import { StyleSheet, View } from "react-native";

import { EventCard } from "../../../../components/organisms";
import { useOnboardingArtworkContext } from "./OnboardingArtworkContext";

export function OnboardingEventsArtwork() {
  const { allEncounters, copy, featuredEvent, language } = useOnboardingArtworkContext();

  return (
    <View pointerEvents="none" style={styles.eventPreview}>
      <EventCard
        copy={copy}
        encounters={allEncounters}
        event={featuredEvent}
        language={language}
        onOpenEvent={() => undefined}
        onToggleSaved={() => undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventPreview: {
    flex: 1,
    justifyContent: "center",
    transform: [{ scale: 0.86 }],
    marginHorizontal: -28,
    marginVertical: -14,
  },
});
