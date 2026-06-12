import { StyleSheet, View } from "react-native";

import { SocialLinkPill } from "../../../../components/molecules";
import { EncounterCard } from "../../../../components/organisms";
import { useOnboardingArtworkContext } from "./OnboardingArtworkContext";

export function OnboardingPeopleArtwork() {
  const { featuredEncounter, language } = useOnboardingArtworkContext();

  return (
    <View pointerEvents="none" style={styles.previewStack}>
      <View style={styles.encounterPreview}>
        <EncounterCard
          encounter={featuredEncounter}
          language={language}
          onPress={() => undefined}
        />
      </View>

      <View style={styles.socialRow}>
        {featuredEncounter.socials.slice(0, 3).map((link) => (
          <SocialLinkPill key={`${link.provider}-${link.value}`} link={link} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewStack: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  encounterPreview: {
    transform: [{ scale: 0.92 }],
    marginHorizontal: -12,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: -8,
  },
});
