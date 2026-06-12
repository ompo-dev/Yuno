import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { theme } from "../../../theme";
import { SheetSearchBar } from "../../../components/molecules";
import { BottomSheetModal } from "../../../components/organisms";

interface FilterableSheetScaffoldProps {
  activeFilterCount: number;
  bodyStyle?: StyleProp<ViewStyle>;
  bottomInset: number;
  children: ReactNode;
  count: number;
  onChangeQuery: (value: string) => void;
  onClose: () => void;
  onOpenFilters: () => void;
  overlayContent?: ReactNode;
  placeholder: string;
  query: string;
  title: string;
  visible: boolean;
}

export function FilterableSheetScaffold({
  activeFilterCount,
  bodyStyle,
  bottomInset,
  children,
  count,
  onChangeQuery,
  onClose,
  onOpenFilters,
  overlayContent,
  placeholder,
  query,
  title,
  visible,
}: FilterableSheetScaffoldProps) {
  return (
    <BottomSheetModal
      bodyStyle={[styles.body, bodyStyle]}
      bottomInset={bottomInset}
      onClose={onClose}
      overlayContent={overlayContent}
      visible={visible}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{count}</Text>
      </View>

      <SheetSearchBar
        activeFilterCount={activeFilterCount}
        onChangeText={onChangeQuery}
        onOpenFilters={onOpenFilters}
        placeholder={placeholder}
        value={query}
      />

      {children}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  meta: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.muted,
  },
});
