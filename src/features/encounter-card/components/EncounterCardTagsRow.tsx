import { ScrollView, StyleSheet } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { Encounter, Language } from "../../../types";
import {
  getEncounterEventTone,
  getEncounterFollowUpLabel,
  getEncounterInteractionCopy,
} from "../model";
import { resolveLocalizedText } from "../../../i18n";

interface EncounterCardTagsRowProps {
  encounter: Encounter;
  language: Language;
}

export function EncounterCardTagsRow({
  encounter,
  language,
}: EncounterCardTagsRowProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.tagsRow}
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
    >
      <InfoChip
        icon="people-outline"
        label={resolveLocalizedText(encounter.event, language)}
        tone={getEncounterEventTone(encounter)}
      />
      <InfoChip
        icon={encounter.interactionIcon ?? "chatbubble-ellipses-outline"}
        label={getEncounterInteractionCopy(encounter, language)}
      />
      <InfoChip
        icon={encounter.connected ? "checkmark-circle-outline" : "ellipse-outline"}
        label={getEncounterFollowUpLabel(encounter, language)}
        tone={encounter.connected ? "green" : "neutral"}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 4,
  },
});
