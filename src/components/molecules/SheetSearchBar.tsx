import { Ionicons } from "@expo/vector-icons";
import { Keyboard, Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../theme";
import { KeyboardAccessory, keyboardAccessoryId } from "./KeyboardAccessory";
import { MotionPressable } from "../atoms/MotionPressable";

interface SheetSearchBarProps {
  activeFilterCount?: number;
  onChangeText: (value: string) => void;
  onOpenFilters: () => void;
  placeholder: string;
  surfaceTone?: "soft" | "white";
  value: string;
}

export function SheetSearchBar({
  activeFilterCount = 0,
  onChangeText,
  onOpenFilters,
  placeholder,
  surfaceTone = "soft",
  value,
}: SheetSearchBarProps) {
  const useWhiteSurface = surfaceTone === "white";

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.searchField,
          useWhiteSurface ? styles.searchFieldWhite : null,
        ]}
      >
        <Ionicons color={theme.colors.muted} name="search-outline" size={16} />
        <TextInput
          inputAccessoryViewID={Platform.OS === "ios" ? keyboardAccessoryId : undefined}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
          value={value}
        />
      </View>

      <MotionPressable
        contentStyle={[
          styles.filterButton,
          useWhiteSurface ? styles.filterButtonWhite : null,
        ]}
        onPress={() => {
          Keyboard.dismiss();
          onOpenFilters();
        }}
      >
        <Ionicons color={theme.colors.ink} name="options-outline" size={16} />
        {activeFilterCount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{activeFilterCount}</Text>
          </View>
        ) : null}
      </MotionPressable>

      <KeyboardAccessory />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchField: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.ink,
    paddingVertical: 10,
  },
  searchFieldWhite: {
    backgroundColor: theme.colors.surface,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  filterButtonWhite: {
    backgroundColor: theme.colors.surface,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 4,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
