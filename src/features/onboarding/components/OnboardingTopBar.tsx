import { StyleSheet, Text, View } from "react-native";

import { SegmentedControl } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { Language, LanguageOption } from "../../../types";

interface OnboardingTopBarProps {
  copy: AppCopy;
  isIntroStage: boolean;
  language: Language;
  languageOptions: LanguageOption[];
  onLanguageChange: (language: Language) => void;
  stepLabel: string;
}

export function OnboardingTopBar({
  copy,
  isIntroStage,
  language,
  languageOptions,
  onLanguageChange,
  stepLabel,
}: OnboardingTopBarProps) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>Yuno</Text>
        <Text style={styles.brandMeta}>
          {isIntroStage ? stepLabel : copy.onboarding.auth.eyebrow}
        </Text>
      </View>

      <View style={styles.languageWrap}>
        <SegmentedControl
          onChange={onLanguageChange}
          options={languageOptions}
          value={language}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brandBlock: {
    flex: 1,
    gap: 4,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  brandMeta: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.muted,
  },
  languageWrap: {
    width: 132,
  },
});
