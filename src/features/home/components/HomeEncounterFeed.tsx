import { StyleSheet, View } from "react-native";

import { FadeInView } from "../../../components/atoms";
import { EncounterCard } from "../../../components/organisms";
import { Encounter, Language } from "../../../types";

interface HomeEncounterFeedProps {
  encounters: Encounter[];
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function HomeEncounterFeed({
  encounters,
  language,
  onOpenEncounter,
}: HomeEncounterFeedProps) {
  return (
    <View style={styles.list}>
      {encounters.map((encounter, index) => (
        <FadeInView delay={index * 40} key={encounter.id}>
          <EncounterCard
            encounter={encounter}
            language={language}
            onPress={onOpenEncounter}
          />
        </FadeInView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
});
