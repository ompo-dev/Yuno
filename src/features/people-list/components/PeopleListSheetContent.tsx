import { StyleSheet, View } from "react-native";

import { FadeInView } from "../../../components/atoms";
import { EmptyStatePanel, ProfileListRow } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { getPeopleListEmptyTitle } from "../people-list-model";

interface PeopleListSheetContentProps {
  activeFilterCount: number;
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  onClearFilters: () => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function PeopleListSheetContent({
  activeFilterCount,
  copy,
  encounters,
  language,
  onClearFilters,
  onOpenEncounter,
}: PeopleListSheetContentProps) {
  return (
    <View style={styles.list}>
      {encounters.length ? (
        encounters.map((encounter, index) => (
          <FadeInView delay={index * 35} key={encounter.id}>
            <ProfileListRow
              encounter={encounter}
              language={language}
              onPress={onOpenEncounter}
            />
          </FadeInView>
        ))
      ) : (
        <EmptyStatePanel
          actionLabel={activeFilterCount ? copy.common.clear : undefined}
          icon={activeFilterCount ? "options-outline" : "people-outline"}
          onAction={activeFilterCount ? onClearFilters : undefined}
          title={getPeopleListEmptyTitle(language, activeFilterCount > 0)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
});
