import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ScreenHeader, SheetSearchBar } from "../molecules";
import { FilterOption, FilterSection, FilterDialog } from "./FilterDialog";

interface FilterableScreenLayoutProps {
  activeFilterCount: number;
  children: ReactNode;
  clearLabel: string;
  closeLabel: string;
  description?: string;
  eyebrow?: string;
  filterTitle: string;
  filtersVisible: boolean;
  hasActiveFilters: boolean;
  onChangeQuery: (value: string) => void;
  onClearFilters: () => void;
  onCloseFilters: () => void;
  onOpenFilters: () => void;
  onToggleFilter: (sectionKey: string, optionId: string) => void;
  placeholder: string;
  query: string;
  sections: FilterSection[];
  selected: Record<string, string[]>;
  title: string;
}

export function FilterableScreenLayout({
  activeFilterCount,
  children,
  clearLabel,
  closeLabel,
  description,
  eyebrow,
  filterTitle,
  filtersVisible,
  hasActiveFilters,
  onChangeQuery,
  onClearFilters,
  onCloseFilters,
  onOpenFilters,
  onToggleFilter,
  placeholder,
  query,
  sections,
  selected,
  title,
}: FilterableScreenLayoutProps) {
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          description={description}
          eyebrow={eyebrow}
          title={title}
        />

        <SheetSearchBar
          activeFilterCount={activeFilterCount}
          onChangeText={onChangeQuery}
          onOpenFilters={onOpenFilters}
          placeholder={placeholder}
          surfaceTone="white"
          value={query}
        />

        <View style={styles.body}>{children}</View>
      </ScrollView>

      <FilterDialog
        clearLabel={clearLabel}
        closeLabel={closeLabel}
        hasActiveFilters={hasActiveFilters}
        onClear={onClearFilters}
        onClose={onCloseFilters}
        onToggle={onToggleFilter}
        sections={sections}
        selected={selected}
        title={filterTitle}
        visible={filtersVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 172,
    gap: 16,
  },
  body: {
    gap: 16,
  },
});
