import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { currentUser, initialEncounters, recentEvents } from "../../data/mockData";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { createNoteEventToken, getEncounterNoteEvents } from "../../noteTags";
import { theme } from "../../theme";
import { Language, LocalizedText, MemoryNote } from "../../types";
import { AvatarStack } from "../AvatarStack";
import { EncounterCard } from "../EncounterCard";
import { EventCard } from "../EventCard";
import { GlassCard } from "../GlassCard";
import { InfoChip } from "../InfoChip";
import { InitialsAvatar } from "../InitialsAvatar";
import { MemoryNoteCard } from "../MemoryNoteCard";
import { SocialLinkPill } from "../SocialLinkPill";

type ArtworkVariant = "auth" | "people" | "events" | "notes";

interface OnboardingArtworkProps {
  copy: AppCopy;
  language: Language;
  variant: ArtworkVariant;
}

const localized = (en: string, ptBR: string): LocalizedText => ({
  en,
  "pt-BR": ptBR,
});

export function OnboardingArtwork({
  copy,
  language,
  variant,
}: OnboardingArtworkProps) {
  const featuredEncounter = initialEncounters[0];
  const secondEncounter = initialEncounters[1];
  const thirdEncounter = initialEncounters[2];
  const featuredEvent = recentEvents[0];
  const noteEncounter = initialEncounters[2];
  const noteEvents = getEncounterNoteEvents(noteEncounter, recentEvents, language);
  const primaryNoteLabel = resolveLocalizedText(featuredEvent.name, language);
  const previewNote: MemoryNote = {
    id: "onboarding-note-preview",
    encounterId: noteEncounter.id,
    body: {
      en: `${createNoteEventToken(resolveLocalizedText(featuredEvent.name, "en"))} Follow up with the quiet-attendee prompt she mentioned after the panel.`,
      "pt-BR": `${createNoteEventToken(resolveLocalizedText(featuredEvent.name, "pt-BR"))} lembrar do prompt para participantes mais discretos que ela comentou depois do painel.`,
    },
    createdAt: localized("Saved now", "Salvo agora"),
    createdAtValue: Date.now(),
  };

  if (variant === "auth") {
    return (
      <ArtworkFrame>
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
                <SocialLinkPill
                  link={
                    currentUser.socials.linkedin
                      ? {
                          provider: "linkedin",
                          value: currentUser.socials.linkedin,
                        }
                      : featuredEncounter.socials[0]
                  }
                  onPress={() => undefined}
                />
              </GlassCard>
            </View>
          </GlassCard>
        </View>
      </ArtworkFrame>
    );
  }

  if (variant === "people") {
    return (
      <ArtworkFrame>
        <View pointerEvents="none" style={styles.previewStack}>
          <View style={styles.encounterPreview}>
            <EncounterCard
              encounter={featuredEncounter}
              language={language}
              onPress={() => undefined}
            />
          </View>

          <View style={styles.socialRow}>
            {featuredEncounter.socials.slice(0, 3).map((link) => (
              <SocialLinkPill key={`${link.provider}-${link.value}`} link={link} />
            ))}
          </View>
        </View>
      </ArtworkFrame>
    );
  }

  if (variant === "events") {
    return (
      <ArtworkFrame>
        <View pointerEvents="none" style={styles.eventPreview}>
          <EventCard
            copy={copy}
            encounters={initialEncounters}
            event={featuredEvent}
            language={language}
            onOpenEvent={() => undefined}
            onToggleSaved={() => undefined}
          />
        </View>
      </ArtworkFrame>
    );
  }

  return (
    <ArtworkFrame>
      <View pointerEvents="none" style={styles.notesPreview}>
        <MemoryNoteCard
          copy={copy}
          encounter={noteEncounter}
          language={language}
          note={previewNote}
          noteEvents={[
            {
              id: featuredEvent.id,
              label: primaryNoteLabel,
              tone: featuredEvent.tone,
            },
            ...noteEvents.filter((event) => event.id !== featuredEvent.id),
          ]}
          onPress={() => undefined}
        />
      </View>
    </ArtworkFrame>
  );
}

function ArtworkFrame({ children }: { children: ReactNode }) {
  return (
    <View style={styles.frame}>
      <View style={[styles.glow, styles.glowBlue]} />
      <View style={[styles.glow, styles.glowGreen]} />
      <View style={[styles.glow, styles.glowNeutral]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minHeight: 316,
    borderRadius: 30,
    padding: 12,
    overflow: "hidden",
    backgroundColor: "#FCFDFE",
    borderWidth: 1,
    borderColor: theme.colors.lineStrong,
    ...theme.shadow.card,
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.9,
  },
  glowBlue: {
    top: -32,
    right: -18,
    width: 156,
    height: 156,
    backgroundColor: "#EAF2FF",
  },
  glowGreen: {
    bottom: 24,
    left: -28,
    width: 132,
    height: 132,
    backgroundColor: "#EAF6EC",
  },
  glowNeutral: {
    bottom: -40,
    right: 30,
    width: 146,
    height: 146,
    backgroundColor: "#F4F6F8",
  },
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
  previewStack: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  encounterPreview: {
    transform: [{ scale: 0.92 }],
    marginHorizontal: -12,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: -8,
  },
  eventPreview: {
    flex: 1,
    justifyContent: "center",
    transform: [{ scale: 0.86 }],
    marginHorizontal: -28,
    marginVertical: -14,
  },
  notesPreview: {
    flex: 1,
    justifyContent: "center",
    transform: [{ scale: 0.9 }],
    marginHorizontal: -12,
    marginVertical: -8,
  },
});
