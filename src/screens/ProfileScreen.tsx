import { ScrollView, StyleSheet } from "react-native";

import { useAppShellContext } from "../features/app-shell/AppShellContext";
import {
  ProfileAvatarDialog,
  ProfileActivitySection,
  ProfileHeroCard,
  ProfileInterestDialog,
  ProfileLanguageSection,
  ProfileLinkDialog,
  ProfilePremiumCard,
} from "../features/profile/components";
import { ProfileEditorProvider } from "../features/profile/context";

export function ProfileScreen() {
  const {
    actions,
    copy,
    derived,
    language,
    languageOptions,
    openEncounterSheet,
    setLanguage,
    state: {
      encounters,
      events,
      profile,
    },
  } = useAppShellContext();
  const connectionEventCount = events.filter(
    (event) => event.joined || event.status === "recent",
  ).length;

  return (
    <ProfileEditorProvider
      copy={copy}
      language={language}
      onProfileChange={actions.setProfile}
      profile={profile}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeroCard
          connectedCount={derived.connectedCount}
          connectionEventCount={connectionEventCount}
          copy={copy}
          language={language}
          onOpenConnections={() =>
            actions.openSheet({
              type: "people",
              ids: derived.connectedEncounters.map((item) => item.id),
              title: copy.profile.connectionsTitle,
            })
          }
          onOpenEvents={() =>
            actions.openSheet({
              type: "events",
              ids: derived.joinedOrRecentEvents.map((item) => item.id),
              title: copy.profile.eventsTitle,
            })
          }
        />

        <ProfileActivitySection
          copy={copy}
          encounters={encounters}
          language={language}
          onOpenEncounter={openEncounterSheet}
        />

        <ProfileLanguageSection
          copy={copy}
          language={language}
          languageOptions={languageOptions}
          onLanguageChange={setLanguage}
        />

        <ProfilePremiumCard copy={copy} />
      </ScrollView>

      <ProfileInterestDialog copy={copy} />
      <ProfileLinkDialog copy={copy} />
      <ProfileAvatarDialog copy={copy} />
    </ProfileEditorProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 172,
    gap: 16,
  },
});
