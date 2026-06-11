import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";
import { InfoChip } from "./InfoChip";
import { MotionPressable } from "./MotionPressable";

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterSection {
  key: string;
  options: FilterOption[];
  title: string;
}

interface FilterDialogProps {
  clearLabel: string;
  closeLabel: string;
  hasActiveFilters?: boolean;
  onClear: () => void;
  onClose: () => void;
  onToggle: (sectionKey: string, optionId: string) => void;
  sections: FilterSection[];
  selected: Record<string, string[]>;
  title: string;
  visible: boolean;
}

export function FilterDialog({
  clearLabel,
  closeLabel,
  hasActiveFilters = false,
  onClear,
  onClose,
  onToggle,
  sections,
  selected,
  title,
  visible,
}: FilterDialogProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable onPress={onClose} style={styles.backdrop} />

      <View style={styles.dialog}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerActions}>
            {hasActiveFilters ? (
              <MotionPressable contentStyle={styles.textButton} onPress={onClear}>
                <Text style={styles.textButtonLabel}>{clearLabel}</Text>
              </MotionPressable>
            ) : null}
            <MotionPressable contentStyle={styles.textButtonStrong} onPress={onClose}>
              <Text style={styles.textButtonStrongLabel}>{closeLabel}</Text>
            </MotionPressable>
          </View>
        </View>

        <View style={styles.sectionList}>
          {sections.map((section) => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              <View style={styles.optionWrap}>
                {section.options.map((option) => {
                  const isActive = selected[section.key]?.includes(option.id);

                  return (
                    <InfoChip
                      key={option.id}
                      label={option.label}
                      onPress={() => onToggle(section.key, option.id)}
                      tone={isActive ? "blue" : "neutral"}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    gap: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    padding: 20,
    ...theme.shadow.floating,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  textButton: {
    paddingVertical: 6,
  },
  textButtonLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  textButtonStrong: {
    paddingVertical: 6,
  },
  textButtonStrongLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  sectionList: {
    gap: 18,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
