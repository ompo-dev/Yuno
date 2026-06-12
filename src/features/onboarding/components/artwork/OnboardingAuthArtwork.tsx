import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../../../../components/atoms/GlassCard";
import { InfoChip } from "../../../../components/atoms/InfoChip";
import { InitialsAvatar } from "../../../../components/atoms/InitialsAvatar";
import { AvatarStack } from "../../../../components/molecules/AvatarStack";
import { SocialLinkPill } from "../../../../components/molecules/SocialLinkPill";
import { resolveLocalizedText } from "../../../../i18n";
import { theme } from "../../../../theme";
import { useOnboardingArtworkContext } from "./OnboardingArtworkContext";

export function OnboardingAuthArtwork() {
  const {
    copy,
    featuredEncounter,
    language,
    secondEncounter,
    thirdEncounter,
  } = useOnboardingArtworkContext();

  return (
    <View pointerEvents="none">
      <GlassCard style={styles.authPanel}>
        <View style={styles.authTopRow}>
          <InfoChip icon="sparkles-outline" label="Yuno" tone="blue" />
          <InfoChip
            icon="radio-outline"
            label={copy.home.radarDetectedCompact(3)}
            tone="green"
          />
        </View>

        <View style={styles.authHeroRow}>
          <AvatarStack
            encounters={[featuredEncounter, secondEncounter, thirdEncounter]}
            max={3}
            size={40}
          />

          <View style={styles.authHeroCopy}>
            <Text style={styles.authHeroTitle}>
              {language === "pt-BR"
                ? "Networking sem perder contexto"
                : "Networking without losing context"}
            </Text>
            <Text style={styles.authHeroBody}>
              {language === "pt-BR"
                ? "Perfis, eventos e notas ficam prontos para o follow-up."
                : "Profiles, events, and notes stay ready for the follow-up."}
            </Text>
          </View>
        </View>

        <View style={styles.authGrid}>
          <GlassCard style={styles.authMiniCard}>
            <View style={styles.authMiniHeader}>
              <InitialsAvatar
                gradient={featuredEncounter.gradient}
                imageUrl={featuredEncounter.avatarUrl}
                initials={featuredEncounter.initials}
                size={34}
              />
              <View style={styles.authMiniCopy}>
                <Text numberOfLines={1} style={styles.authMiniTitle}>
                  {featuredEncounter.name}
                </Text>
                <Text numberOfLines={1} style={styles.authMiniBody}>
                  {resolveLocalizedText(featuredEncounter.role, language)}
                </Text>
              </View>
            </View>
            <InfoChip
              icon="people-outline"
              label={resolveLocalizedText(featuredEncounter.event, language)}
              tone="blue"
            />
          </GlassCard>

          <GlassCard style={styles.authMiniCard}>
            <Text style={styles.authMiniCaption}>
              {language === "pt-BR" ? "Link pronto" : "Ready link"}
            </Text>
            <SocialLinkPill link={featuredEncounter.socials[0]} />
          </GlassCard>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  authPanel: {
    gap: 14,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  authTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  authHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  authHeroCopy: {
    flex: 1,
    gap: 4,
  },
  authHeroTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  authHeroBody: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.muted,
  },
  authGrid: {
    flexDirection: "row",
    gap: 10,
  },
  authMiniCard: {
    flex: 1,
    gap: 10,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  authMiniHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  authMiniCopy: {
    flex: 1,
    gap: 2,
  },
  authMiniTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  authMiniBody: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.muted,
  },
  authMiniCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
