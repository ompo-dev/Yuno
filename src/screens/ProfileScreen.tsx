import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { GlassCard } from "../components/GlassCard";
import { InfoChip } from "../components/InfoChip";
import { InitialsAvatar } from "../components/InitialsAvatar";
import {
  KeyboardAccessory,
  keyboardAccessoryId,
} from "../components/KeyboardAccessory";
import { MotionPressable } from "../components/MotionPressable";
import { ProfileDialog } from "../components/ProfileDialog";
import { SegmentedControl } from "../components/SegmentedControl";
import { SocialLinkPill } from "../components/SocialLinkPill";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { animateLayoutTransition } from "../motion";
import {
  buildSocialUrl,
  detectSocialProvider,
  formatSocialValue,
  normalizeSocialValue,
  socialProviderConfig,
  socialProviderOrder,
} from "../socialLinks";
import {
  Encounter,
  EventSummary,
  Language,
  LanguageOption,
  LocalizedText,
  SocialLink,
  SocialProvider,
  UserProfile,
} from "../types";
import { theme } from "../theme";

interface ProfileScreenProps {
  connectedCount: number;
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  joinedEventCount: number;
  language: Language;
  languageOptions: LanguageOption[];
  onLanguageChange: (value: Language) => void;
  onOpenConnections: () => void;
  onOpenEncounter: (encounter: Encounter) => void;
  onOpenEvents: () => void;
  onProfileChange: (profile: UserProfile) => void;
  profile: UserProfile;
  recentEncounterCount: number;
}

interface LinkDialogState {
  initialProvider: SocialProvider | null;
  value: string;
}

const avatarOptions = [
  "https://i.pravatar.cc/160?img=68",
  "https://i.pravatar.cc/160?img=33",
  "https://i.pravatar.cc/160?img=16",
  "https://i.pravatar.cc/160?img=45",
  "https://i.pravatar.cc/160?img=53",
  "https://i.pravatar.cc/160?img=12",
];

function deriveInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function localizedValue(value: string): LocalizedText {
  return {
    en: value,
    "pt-BR": value,
  };
}

function getProfileSubtitle(
  profile: UserProfile,
  language: Language,
  copy: AppCopy,
) {
  const subtitle = resolveLocalizedText(profile.role, language).trim();
  const company = profile.company.trim();

  if (subtitle && company) {
    return `${subtitle} ${copy.common.at} ${company}`;
  }

  return subtitle || company;
}

function buildEditableSocialValue(provider: SocialProvider, value: string) {
  if (provider === "email" || provider === "whatsapp") {
    return formatSocialValue(provider, value);
  }

  return buildSocialUrl(provider, value) ?? formatSocialValue(provider, value);
}

export function ProfileScreen({
  connectedCount,
  copy,
  encounters,
  events,
  joinedEventCount,
  language,
  languageOptions,
  onLanguageChange,
  onOpenConnections,
  onOpenEncounter,
  onOpenEvents,
  onProfileChange,
  profile,
  recentEncounterCount,
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
  const [interestDialogVisible, setInterestDialogVisible] = useState(false);
  const [interestDraft, setInterestDraft] = useState("");
  const [linkDialog, setLinkDialog] = useState<LinkDialogState | null>(null);
  const [avatarDialogVisible, setAvatarDialogVisible] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftProfile(profile);
    }
  }, [isEditing, profile]);

  const currentProfile = isEditing ? draftProfile : profile;
  const connectionEventCount = events.filter(
    (event) => event.joined || event.status === "recent",
  ).length;
  const currentInitials = deriveInitials(currentProfile.fullName);
  const currentSubtitle = getProfileSubtitle(currentProfile, language, copy);
  const socialLinks = useMemo(
    () =>
      socialProviderOrder
        .map((provider) => ({
          provider,
          value: currentProfile.socials[provider] ?? "",
        }))
        .filter((item): item is SocialLink => Boolean(item.value)),
    [currentProfile.socials],
  );
  const linkDialogProvider = linkDialog
    ? (detectSocialProvider(linkDialog.value) ?? linkDialog.initialProvider)
    : null;
  const normalizedDialogLink =
    linkDialog && linkDialogProvider
      ? normalizeSocialValue(linkDialogProvider, linkDialog.value)
      : "";

  const updateLocalizedField = (field: "role" | "headline", value: string) => {
    const currentValue = currentProfile[field];
    const nextValue: LocalizedText =
      typeof currentValue === "string"
        ? value
        : { ...currentValue, [language]: value };

    setDraftProfile((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const startEditing = () => {
    animateLayoutTransition();
    setDraftProfile({
      ...profile,
      company: "",
      role: localizedValue(getProfileSubtitle(profile, language, copy)),
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    animateLayoutTransition();
    setDraftProfile(profile);
    setIsEditing(false);
    setInterestDialogVisible(false);
    setLinkDialog(null);
    setAvatarDialogVisible(false);
  };

  const saveEditing = () => {
    animateLayoutTransition();

    const firstName =
      draftProfile.fullName.trim().split(/\s+/)[0] ?? draftProfile.fullName;
    onProfileChange({
      ...draftProfile,
      firstName: localizedValue(firstName),
    });
    setIsEditing(false);
    setInterestDialogVisible(false);
    setLinkDialog(null);
    setAvatarDialogVisible(false);
  };

  const removeInterest = (label: string) => {
    animateLayoutTransition();
    setDraftProfile((current) => ({
      ...current,
      interests: current.interests.filter(
        (interest) => resolveLocalizedText(interest, language) !== label,
      ),
    }));
  };

  const saveInterest = () => {
    const trimmed = interestDraft.trim();

    if (!trimmed) {
      return;
    }

    animateLayoutTransition();
    setDraftProfile((current) => {
      if (
        current.interests.some(
          (interest) =>
            resolveLocalizedText(interest, language).toLowerCase() ===
            trimmed.toLowerCase(),
        )
      ) {
        return current;
      }

      return {
        ...current,
        interests: [...current.interests, localizedValue(trimmed)],
      };
    });
    setInterestDraft("");
    setInterestDialogVisible(false);
  };

  const openCreateLinkDialog = () => {
    setLinkDialog({
      initialProvider: null,
      value: "",
    });
  };

  const openEditLinkDialog = (provider: SocialProvider) => {
    setLinkDialog({
      initialProvider: provider,
      value: buildEditableSocialValue(
        provider,
        draftProfile.socials[provider] ?? "",
      ),
    });
  };

  const saveLink = () => {
    if (!linkDialogProvider || !normalizedDialogLink) {
      return;
    }

    animateLayoutTransition();
    setDraftProfile((current) => {
      const nextSocials = { ...current.socials };

      if (
        linkDialog?.initialProvider &&
        linkDialog.initialProvider !== linkDialogProvider
      ) {
        delete nextSocials[linkDialog.initialProvider];
      }

      nextSocials[linkDialogProvider] = normalizedDialogLink;

      return {
        ...current,
        socials: nextSocials,
      };
    });
    setLinkDialog(null);
  };

  const removeLink = () => {
    if (!linkDialog?.initialProvider) {
      return;
    }

    animateLayoutTransition();
    setDraftProfile((current) => {
      const nextSocials = { ...current.socials };
      delete nextSocials[linkDialog.initialProvider!];

      return {
        ...current,
        socials: nextSocials,
      };
    });
    setLinkDialog(null);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <View style={styles.floatingActionWrap}>
            {isEditing ? (
              <View style={styles.headerActions}>
                <MotionPressable
                  contentStyle={styles.headerGhost}
                  onPress={cancelEditing}
                >
                  <Text style={styles.headerGhostLabel}>
                    {copy.profile.cancel}
                  </Text>
                </MotionPressable>
                <MotionPressable
                  contentStyle={styles.headerPrimary}
                  onPress={saveEditing}
                >
                  <Text style={styles.headerPrimaryLabel}>
                    {copy.profile.done}
                  </Text>
                </MotionPressable>
              </View>
            ) : (
              <MotionPressable
                contentStyle={styles.headerPrimary}
                onPress={startEditing}
              >
                <Text style={styles.headerPrimaryLabel}>
                  {copy.profile.edit}
                </Text>
              </MotionPressable>
            )}
          </View>

          <GlassCard style={styles.heroCard}>
            <View style={styles.profileTop}>
              <MotionPressable
                contentStyle={styles.avatarButton}
                onPress={() => {
                  if (isEditing) {
                    setAvatarDialogVisible(true);
                  }
                }}
                pressScale={isEditing ? 0.985 : 1}
              >
                <InitialsAvatar
                  gradient={["#8EA3FF", "#4E66F7"]}
                  imageUrl={currentProfile.avatarUrl}
                  initials={currentInitials}
                  size={72}
                />

                {isEditing ? (
                  <BlurView
                    intensity={28}
                    style={styles.avatarOverlay}
                    tint="dark"
                  >
                    <Ionicons
                      color={theme.colors.white}
                      name="image-outline"
                      size={18}
                    />
                  </BlurView>
                ) : null}
              </MotionPressable>

              <View style={styles.profileMeta}>
                {isEditing ? (
                  <>
                    <TextInput
                      inputAccessoryViewID={
                        Platform.OS === "ios" ? keyboardAccessoryId : undefined
                      }
                      onChangeText={(value) =>
                        setDraftProfile((current) => ({
                          ...current,
                          fullName: value,
                        }))
                      }
                      placeholder={copy.profile.fullNameLabel}
                      placeholderTextColor={theme.colors.muted}
                      style={styles.nameInput}
                      value={draftProfile.fullName}
                    />

                    <TextInput
                      inputAccessoryViewID={
                        Platform.OS === "ios" ? keyboardAccessoryId : undefined
                      }
                      onChangeText={(value) =>
                        updateLocalizedField("role", value)
                      }
                      placeholder={copy.profile.subtitleLabel}
                      placeholderTextColor={theme.colors.muted}
                      style={styles.subtitleInput}
                      value={resolveLocalizedText(draftProfile.role, language)}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.name}>{currentProfile.fullName}</Text>
                    <Text style={styles.role}>{currentSubtitle}</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.heroTags}>
              <InfoChip
                icon="git-network-outline"
                label={copy.detail.totalConnections(connectedCount)}
                onPress={onOpenConnections}
              />
              <InfoChip
                icon="calendar-outline"
                label={`${connectionEventCount} ${copy.profile.joinedEvents}`}
                onPress={onOpenEvents}
              />
            </View>

            {isEditing ? (
              <TextInput
                inputAccessoryViewID={
                  Platform.OS === "ios" ? keyboardAccessoryId : undefined
                }
                multiline
                onChangeText={(value) =>
                  updateLocalizedField("headline", value)
                }
                placeholder={copy.profile.headlineLabel}
                placeholderTextColor={theme.colors.muted}
                style={styles.headlineInput}
                textAlignVertical="top"
                value={resolveLocalizedText(draftProfile.headline, language)}
              />
            ) : (
              <Text style={styles.headline}>
                {resolveLocalizedText(currentProfile.headline, language)}
              </Text>
            )}

            <View style={styles.interests}>
              {currentProfile.interests.map((interest) => {
                const label = resolveLocalizedText(interest, language);

                return (
                  <InfoChip
                    key={label}
                    label={label}
                    onPress={
                      isEditing ? () => removeInterest(label) : undefined
                    }
                    rightSlot={
                      isEditing ? (
                        <Ionicons
                          color={theme.colors.muted}
                          name="close"
                          size={12}
                        />
                      ) : undefined
                    }
                  />
                );
              })}

              {isEditing ? (
                <InfoChip
                  icon="add"
                  label={copy.profile.addInterest}
                  onPress={() => setInterestDialogVisible(true)}
                />
              ) : null}
            </View>

            <View style={styles.linkGroup}>
              {socialLinks.map((link) => (
                <SocialLinkPill
                  key={`${link.provider}-${link.value}`}
                  link={link}
                  onPress={
                    isEditing
                      ? () => openEditLinkDialog(link.provider)
                      : undefined
                  }
                />
              ))}

              {isEditing ? (
                <InfoChip
                  icon="add"
                  label={copy.profile.addLink}
                  onPress={openCreateLinkDialog}
                />
              ) : null}
            </View>

            <KeyboardAccessory label={copy.common.keyboardDone} />
          </GlassCard>
        </View>

        <GlassCard style={styles.controlCard}>
          <ActivityHeatmap
            copy={copy}
            encounters={encounters}
            language={language}
            onOpenEncounter={onOpenEncounter}
          />
        </GlassCard>

        <GlassCard style={styles.controlCard}>
          <Text style={styles.sectionTitle}>{copy.profile.languageTitle}</Text>
          <SegmentedControl
            onChange={onLanguageChange}
            options={languageOptions}
            value={language}
          />
        </GlassCard>

        <GlassCard style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Ionicons
              color={theme.colors.muted}
              name="diamond-outline"
              size={18}
            />
            <Text style={styles.premiumTitle}>{copy.profile.premiumTitle}</Text>
          </View>
          <Text style={styles.sectionBody}>{copy.profile.premiumBody}</Text>
        </GlassCard>
      </ScrollView>

      <ProfileDialog
        footer={
          <>
            <MotionPressable
              contentStyle={styles.dialogGhostButton}
              onPress={() => {
                setInterestDraft("");
                setInterestDialogVisible(false);
              }}
            >
              <Text style={styles.dialogGhostLabel}>{copy.profile.cancel}</Text>
            </MotionPressable>
            <MotionPressable
              contentStyle={styles.dialogPrimaryButton}
              onPress={saveInterest}
            >
              <Text style={styles.dialogPrimaryLabel}>
                {copy.profile.addInterest}
              </Text>
            </MotionPressable>
          </>
        }
        onClose={() => {
          setInterestDraft("");
          setInterestDialogVisible(false);
        }}
        subtitle={copy.profile.interestsBody}
        title={copy.profile.interestsTitle}
        visible={interestDialogVisible}
      >
        <TextInput
          autoFocus
          inputAccessoryViewID={
            Platform.OS === "ios" ? keyboardAccessoryId : undefined
          }
          onChangeText={setInterestDraft}
          placeholder={copy.profile.addInterestPlaceholder}
          placeholderTextColor={theme.colors.muted}
          style={styles.dialogInput}
          value={interestDraft}
        />
        <KeyboardAccessory label={copy.common.keyboardDone} />
      </ProfileDialog>

      <ProfileDialog
        footer={
          <View style={styles.dialogFooterRow}>
            {linkDialog?.initialProvider ? (
              <MotionPressable
                contentStyle={styles.dialogGhostButton}
                onPress={removeLink}
              >
                <Text style={styles.dialogGhostLabel}>
                  {copy.profile.removeLink}
                </Text>
              </MotionPressable>
            ) : (
              <View />
            )}

            <View style={styles.dialogFooterActions}>
              <MotionPressable
                contentStyle={styles.dialogGhostButton}
                onPress={() => setLinkDialog(null)}
              >
                <Text style={styles.dialogGhostLabel}>
                  {copy.profile.cancel}
                </Text>
              </MotionPressable>
              <MotionPressable
                contentStyle={[
                  styles.dialogPrimaryButton,
                  (!linkDialogProvider || !normalizedDialogLink) &&
                    styles.dialogPrimaryDisabled,
                ]}
                onPress={saveLink}
                pressScale={
                  !linkDialogProvider || !normalizedDialogLink ? 1 : 0.985
                }
              >
                <Text style={styles.dialogPrimaryLabel}>
                  {linkDialog?.initialProvider
                    ? copy.profile.editLink
                    : copy.profile.addLink}
                </Text>
              </MotionPressable>
            </View>
          </View>
        }
        onClose={() => setLinkDialog(null)}
        title={
          linkDialog?.initialProvider
            ? copy.profile.editLink
            : copy.profile.addLink
        }
        visible={Boolean(linkDialog)}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          inputAccessoryViewID={
            Platform.OS === "ios" ? keyboardAccessoryId : undefined
          }
          onChangeText={(value) =>
            setLinkDialog((current) =>
              current ? { ...current, value } : current,
            )
          }
          placeholder={copy.profile.socialLinkPlaceholder}
          placeholderTextColor={theme.colors.muted}
          style={styles.dialogInput}
          value={linkDialog?.value ?? ""}
        />

        {linkDialogProvider && normalizedDialogLink ? (
          <View style={styles.dialogPreviewWrap}>
            <SocialLinkPill
              link={{
                provider: linkDialogProvider,
                value: normalizedDialogLink,
              }}
            />
          </View>
        ) : null}

        <KeyboardAccessory label={copy.common.keyboardDone} />
      </ProfileDialog>

      <ProfileDialog
        footer={
          <MotionPressable
            contentStyle={styles.dialogPrimaryButton}
            onPress={() => setAvatarDialogVisible(false)}
          >
            <Text style={styles.dialogPrimaryLabel}>{copy.profile.done}</Text>
          </MotionPressable>
        }
        onClose={() => setAvatarDialogVisible(false)}
        subtitle={copy.profile.changePhotoHint}
        title={copy.profile.changePhoto}
        visible={avatarDialogVisible}
      >
        <View style={styles.avatarGrid}>
          {avatarOptions.map((avatarUrl) => {
            const isActive = avatarUrl === draftProfile.avatarUrl;

            return (
              <MotionPressable
                contentStyle={[
                  styles.avatarOption,
                  isActive && styles.avatarOptionActive,
                ]}
                key={avatarUrl}
                onPress={() =>
                  setDraftProfile((current) => ({
                    ...current,
                    avatarUrl,
                  }))
                }
              >
                <InitialsAvatar
                  gradient={["#8EA3FF", "#4E66F7"]}
                  imageUrl={avatarUrl}
                  initials={currentInitials}
                  size={58}
                />
              </MotionPressable>
            );
          })}
        </View>
      </ProfileDialog>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 172,
    gap: 16,
  },
  heroWrap: {
    position: "relative",
  },
  floatingActionWrap: {
    position: "absolute",
    top: -15,
    right: -14,
    zIndex: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerGhost: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerGhostLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  headerPrimary: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerPrimaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.white,
  },
  heroCard: {
    gap: 16,
    paddingTop: 22,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 16,
  },
  avatarButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.16)",
  },
  profileMeta: {
    flex: 1,
    minHeight: 72,
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  nameInput: {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  role: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  subtitleInput: {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  headline: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  headlineInput: {
    minHeight: 42,
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  linkGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  controlCard: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  premiumCard: {
    gap: 10,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  dialogInput: {
    minHeight: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.ink,
  },
  dialogPreviewWrap: {
    paddingTop: 2,
  },
  dialogGhostButton: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dialogGhostLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  dialogPrimaryButton: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dialogPrimaryDisabled: {
    opacity: 0.45,
  },
  dialogPrimaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.white,
  },
  dialogFooterRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  dialogFooterActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarOption: {
    width: 74,
    height: 74,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  avatarOptionActive: {
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.blueSoft,
  },
});
