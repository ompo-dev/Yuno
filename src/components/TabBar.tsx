import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";

import { AppCopy } from "../i18n";
import { TabId } from "../types";
import { theme } from "../theme";
import { GlassCard } from "./GlassCard";
import { MotionPressable } from "./MotionPressable";

interface TabBarProps {
  activeTab: TabId;
  bottomInset: number;
  copy: AppCopy;
  onTabPress: (tab: TabId) => void;
}

const tabs: {
  activeIcon: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  key: keyof AppCopy["tabs"];
  value: TabId;
}[] = [
  {
    activeIcon: "home",
    icon: "home-outline",
    key: "home",
    value: "home",
  },
  {
    activeIcon: "calendar",
    icon: "calendar-outline",
    key: "events",
    value: "events",
  },
  {
    activeIcon: "document-text",
    icon: "document-text-outline",
    key: "notes",
    value: "notes",
  },
  {
    activeIcon: "person",
    icon: "person-outline",
    key: "profile",
    value: "profile",
  },
];

function supportsNativeMenuBarGlass() {
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

export const TabBar = memo(function TabBar({
  activeTab,
  bottomInset,
  copy,
  onTabPress,
}: TabBarProps) {
  const nativeGlassEnabled = supportsNativeMenuBarGlass();

  const content = (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const selected = tab.value === activeTab;

        return (
          <MotionPressable
            contentStyle={[styles.tab, selected && styles.tabActive]}
            key={tab.value}
            onPress={() => onTabPress(tab.value)}
            pressScale={0.96}
            style={styles.tabTouch}
          >
            <Ionicons
              color={selected ? theme.colors.ink : theme.colors.muted}
              name={selected ? tab.activeIcon : tab.icon}
              size={20}
            />
            <Text style={[styles.label, selected && styles.labelActive]}>
              {copy.tabs[tab.key]}
            </Text>
          </MotionPressable>
        );
      })}
    </View>
  );

  if (nativeGlassEnabled) {
    return (
      <GlassView
        glassEffectStyle="regular"
        style={[
          styles.shell,
          styles.shellNative,
          { paddingBottom: 8 + Math.max(0, bottomInset * 0.08) },
        ]}
        tintColor="rgba(250,251,252,0.88)"
      >
        {content}
      </GlassView>
    );
  }

  return (
    <GlassCard
      style={[styles.shell, { paddingBottom: 8 + Math.max(0, bottomInset * 0.08) }]}
    >
      {content}
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  shell: {
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadow.floating,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shellNative: {
    overflow: "hidden",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  tabTouch: {
    flex: 1,
  },
  tabActive: {
    backgroundColor: "rgba(31,35,40,0.06)",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  labelActive: {
    color: theme.colors.ink,
  },
});
