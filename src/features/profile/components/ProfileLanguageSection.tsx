import { StyleSheet, Text } from "react-native";

import { GlassCard } from "../../../components/atoms";
import { SegmentedControl } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { Language, LanguageOption } from "../../../types";

interface ProfileLanguageSectionProps {
  copy: AppCopy;
  language: Language;
  languageOptions: LanguageOption[];
  onLanguageChange: (value: Language) => void;
}

export function ProfileLanguageSection({
  copy,
  language,
  languageOptions,
  onLanguageChange,
}: ProfileLanguageSectionProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{copy.profile.languageTitle}</Text>
      <SegmentedControl
        onChange={onLanguageChange}
        options={languageOptions}
        value={language}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.ink,
  },
});
