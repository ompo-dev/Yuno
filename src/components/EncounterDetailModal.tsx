import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutRectangle,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { canAccessEncounter, getMutualConnections } from "../encounterUtils";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { NoteEventTag } from "../noteTags";
import { Encounter, Language, MemoryNote } from "../types";
import { theme } from "../theme";
import { AvatarStack } from "./AvatarStack";
import { BottomSheetModal } from "./BottomSheetModal";
import { InfoChip } from "./InfoChip";
import { InitialsAvatar } from "./InitialsAvatar";
import { MotionPressable } from "./MotionPressable";
import { NoteComposerModal } from "./NoteComposerModal";
import { RichNoteText } from "./RichNoteText";
import { SocialLinkPill } from "./SocialLinkPill";

interface EncounterDetailModalProps {
  allEncounters: Encounter[];
  bottomInset: number;
  composerNote: MemoryNote | null;
  copy: AppCopy;
  encounter: Encounter | null;
  isNoteComposerVisible: boolean;
  language: Language;
  onClose: () => void;
  onCloseNoteComposer: () => void;
  onDeleteNote: (noteId: string) => void;
  onEditNote: (note: MemoryNote) => void;
  onOpenEvent: (eventId: string) => void;
  onOpenMutualConnections: (title: string, ids: string[]) => void;
  onOpenSharedEvents: (title: string, ids: string[]) => void;
  onRequestCreateNote: (encounterId: string) => void;
  onSaveNote: (body: string) => void;
  onToggleConnect: (encounterId: string) => void;
  savedNotes: MemoryNote[];
  suggestedEvents: NoteEventTag[];
  visible: boolean;
}

type ActiveMenu =
  | { type: "header"; anchor: LayoutRectangle }
  | { type: "note"; anchor: LayoutRectangle; note: MemoryNote }
  | null;

export function EncounterDetailModal({
  allEncounters,
  bottomInset,
  composerNote,
  copy,
  encounter,
  isNoteComposerVisible,
  language,
  onClose,
  onCloseNoteComposer,
  onDeleteNote,
  onEditNote,
  onOpenEvent,
  onOpenMutualConnections,
  onOpenSharedEvents,
  onRequestCreateNote,
  onSaveNote,
  onToggleConnect,
  savedNotes,
  suggestedEvents,
  visible,
}: EncounterDetailModalProps) {
  const [cachedEncounter, setCachedEncounter] = useState(encounter);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const headerMenuAnchorRef = useRef<View | null>(null);
  const noteMenuAnchorRefs = useRef<Record<string, View | null>>({});
  const { width: windowWidth } = useWindowDimensions();
  const activeEncounter = encounter ?? cachedEncounter;

  useEffect(() => {
    if (encounter) {
      setCachedEncounter(encounter);
    }
  }, [encounter]);

  useEffect(() => {
    setActiveMenu(null);
  }, [activeEncounter?.id]);

  const eventTone =
    activeEncounter?.eventTone === "green"
      ? "green"
      : activeEncounter?.eventTone === "purple"
        ? "purple"
        : "blue";

  const mutualConnections = useMemo(
    () => getMutualConnections(allEncounters, activeEncounter),
    [activeEncounter, allEncounters],
  );
  const dismissMenus = () => setActiveMenu(null);

  const openHeaderMenu = (anchorRef: View | null) => {
    if (!anchorRef) {
      return;
    }

    anchorRef.measureInWindow((x, y, width, height) => {
      setActiveMenu({
        anchor: {
          height,
          width,
          x,
          y,
        },
        type: "header",
      });
    });
  };

  const openNoteMenu = (anchorRef: View | null, note: MemoryNote) => {
    if (!anchorRef) {
      return;
    }

    anchorRef.measureInWindow((x, y, width, height) => {
      setActiveMenu({
        anchor: {
          height,
          width,
          x,
          y,
        },
        note,
        type: "note",
      });
    });
  };

  if (!activeEncounter) {
    return null;
  }

  const floatingMenu = activeMenu ? (
    <View pointerEvents="box-none" style={styles.overlayLayer}>
      <Pressable onPress={dismissMenus} style={styles.menuBackdrop} />
      <View
        style={[
          styles.floatingMenu,
          {
            right: Math.max(18, windowWidth - activeMenu.anchor.x - activeMenu.anchor.width),
            top: activeMenu.anchor.y + activeMenu.anchor.height + 8,
          },
          activeMenu.type === "header"
            ? styles.headerFloatingMenu
            : styles.noteFloatingMenu,
        ]}
      >
        {activeMenu.type === "header" ? (
          <MotionPressable
            contentStyle={styles.headerMenuItem}
            onPress={() => setActiveMenu(null)}
            pressScale={0.98}
          >
            <Ionicons color={theme.colors.ink} name="ban-outline" size={16} />
            <Text style={styles.headerMenuLabel}>{copy.detail.block}</Text>
          </MotionPressable>
        ) : (
          <>
            <MotionPressable
              contentStyle={styles.noteMenuItem}
              onPress={() => {
                setActiveMenu(null);
                onEditNote(activeMenu.note);
              }}
              pressScale={0.98}
            >
              <Ionicons color={theme.colors.ink} name="create-outline" size={15} />
              <Text style={styles.noteMenuLabel}>{copy.notes.editNote}</Text>
            </MotionPressable>
            <MotionPressable
              contentStyle={styles.noteMenuItem}
              onPress={() => {
                setActiveMenu(null);
                onDeleteNote(activeMenu.note.id);
              }}
              pressScale={0.98}
            >
              <Ionicons color={theme.colors.ink} name="trash-outline" size={15} />
              <Text style={styles.noteMenuLabel}>{copy.notes.deleteNote}</Text>
            </MotionPressable>
          </>
        )}
      </View>
    </View>
  ) : null;

  const canInteract = canAccessEncounter(activeEncounter);
  const footer = canInteract ? (
    <MotionPressable
      contentStyle={[
        styles.primaryButton,
        activeEncounter.connected && styles.primaryButtonConnected,
      ]}
      onPress={() => onToggleConnect(activeEncounter.id)}
      pressScale={0.985}
    >
      <Text style={styles.primaryButtonLabel}>
        {activeEncounter.connected ? copy.detail.saved : copy.detail.connect}
      </Text>
      <Ionicons
        color="#FFFFFF"
        name={activeEncounter.connected ? "checkmark-circle" : "arrow-forward"}
        size={18}
      />
    </MotionPressable>
  ) : null;

  return (
    <BottomSheetModal
      bodyStyle={styles.body}
      bottomInset={bottomInset}
      footer={footer}
      freezeKeyboardInset={isNoteComposerVisible}
      onClose={() => {
        dismissMenus();
        onClose();
      }}
      overlayContent={
        <>
          {floatingMenu}
          <NoteComposerModal
            bottomInset={bottomInset}
            copy={copy}
            encounter={activeEncounter}
            language={language}
          note={composerNote}
          onClose={onCloseNoteComposer}
          onSave={onSaveNote}
          suggestedEvents={suggestedEvents}
          visible={isNoteComposerVisible}
        />
        </>
      }
      visible={visible}
    >
      <View style={styles.contentWrap}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <InitialsAvatar
              gradient={activeEncounter.gradient}
              imageUrl={activeEncounter.avatarUrl}
              initials={activeEncounter.initials}
              size={72}
            />

            <View style={styles.heroMeta}>
              <View style={styles.heroTitleRow}>
                <View style={styles.nameWrap}>
                  <Text style={styles.name}>{activeEncounter.name}</Text>
                  {activeEncounter.verified ? (
                    <Ionicons
                      color={theme.colors.blue}
                      name="checkmark-circle"
                      size={16}
                    />
                  ) : null}
                </View>

                <View
                  collapsable={false}
                  ref={headerMenuAnchorRef}
                  style={styles.headerMenuWrap}
                >
                  <MotionPressable
                    contentStyle={styles.moreButton}
                    onPress={() => {
                      if (activeMenu?.type === "header") {
                        setActiveMenu(null);
                        return;
                      }

                      openHeaderMenu(headerMenuAnchorRef.current);
                    }}
                    pressScale={0.96}
                  >
                    <Ionicons
                      color={theme.colors.muted}
                      name="ellipsis-horizontal"
                      size={18}
                    />
                  </MotionPressable>
                </View>
              </View>

              <Text style={styles.role}>
                {resolveLocalizedText(activeEncounter.role, language)} {copy.common.at}{" "}
                {activeEncounter.company}
              </Text>
            </View>
          </View>

          <View style={styles.heroTags}>
            <InfoChip
              icon="people-outline"
              label={resolveLocalizedText(activeEncounter.event, language)}
              onPress={() => {
                dismissMenus();
                onOpenEvent(activeEncounter.eventId);
              }}
              tone={eventTone}
            />
            <InfoChip
              icon="git-network-outline"
              label={copy.detail.totalConnections(activeEncounter.connectionCount)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            {resolveLocalizedText(activeEncounter.description, language)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <InfoChip
            icon="calendar-outline"
            label={copy.detail.sharedEvents(activeEncounter.sharedEventIds.length)}
            onPress={() =>
              onOpenSharedEvents(
                copy.detail.sharedEvents(activeEncounter.sharedEventIds.length),
                activeEncounter.sharedEventIds,
              )
            }
            style={styles.metricChip}
          />

          {mutualConnections.length ? (
            <InfoChip
              label={
                mutualConnections.length < 4
                  ? copy.detail.mutualConnectionsLabel
                  : copy.detail.mutualConnections(mutualConnections.length)
              }
              leftSlot={
                <AvatarStack encounters={mutualConnections} max={3} size={14.3} />
              }
              onPress={() =>
                onOpenMutualConnections(
                  copy.detail.mutualConnections(mutualConnections.length),
                  mutualConnections.map((item) => item.id),
                )
              }
              style={styles.metricChip}
            />
          ) : null}
        </View>

        {canInteract ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.detail.actions}</Text>
              <View style={styles.socialRow}>
                {activeEncounter.socials.map((social) => (
                  <SocialLinkPill key={`${social.provider}-${social.value}`} link={social} />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTopRow}>
                <Text style={styles.sectionTitle}>{copy.detail.notes}</Text>
                <InfoChip
                  icon="add"
                  label={copy.notes.addNote}
                  onPress={() => {
                    dismissMenus();
                    onRequestCreateNote(activeEncounter.id);
                  }}
                />
              </View>

              {savedNotes.length ? (
                <View style={styles.noteList}>
                  {savedNotes.map((note) => {
                    return (
                      <View key={note.id} style={styles.noteItem}>
                        <View style={styles.noteTopRow}>
                          <View style={styles.noteMetaRow}>
                            <Text style={styles.noteMeta}>
                              {resolveLocalizedText(note.createdAt, language)}
                            </Text>
                            {note.updatedAt ? (
                              <Text style={styles.noteMeta}>
                                {resolveLocalizedText(note.updatedAt, language)}
                              </Text>
                            ) : null}
                          </View>

                          <View
                            collapsable={false}
                            ref={(node) => {
                              noteMenuAnchorRefs.current[note.id] = node;
                            }}
                            style={styles.noteMenuWrap}
                          >
                            <MotionPressable
                              contentStyle={styles.noteMoreButton}
                              onPress={() => {
                                if (
                                  activeMenu?.type === "note" &&
                                  activeMenu.note.id === note.id
                                ) {
                                  setActiveMenu(null);
                                  return;
                                }

                                openNoteMenu(noteMenuAnchorRefs.current[note.id], note);
                              }}
                              pressScale={0.96}
                            >
                              <Ionicons
                                color={theme.colors.muted}
                                name="ellipsis-horizontal"
                                size={16}
                              />
                            </MotionPressable>
                          </View>
                        </View>

                        <RichNoteText
                          body={resolveLocalizedText(note.body, language)}
                          events={suggestedEvents}
                          textStyle={styles.noteBody}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </>
        ) : (
          <View style={styles.restrictedCard}>
            <Text style={styles.restrictedTitle}>{copy.detail.restrictedTitle}</Text>
            <Text style={styles.restrictedBody}>{copy.detail.restrictedBody}</Text>
          </View>
        )}

      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 18,
  },
  contentWrap: {
    position: "relative",
    gap: 18,
  },
  hero: {
    gap: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
    zIndex: 6,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  heroMeta: {
    flex: 1,
    gap: 6,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  nameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  headerMenuWrap: {
    zIndex: 6,
  },
  moreButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  floatingMenu: {
    position: "absolute",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceStrong,
    padding: 8,
    overflow: "hidden",
    zIndex: 60,
    elevation: 16,
    ...theme.shadow.floating,
  },
  headerFloatingMenu: {
    minWidth: 148,
  },
  noteFloatingMenu: {
    minWidth: 148,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  headerMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    minWidth: 148,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceStrong,
    padding: 8,
    overflow: "hidden",
    elevation: 10,
    ...theme.shadow.floating,
  },
  headerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
  },
  headerMenuLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  role: {
    fontSize: 15,
    color: theme.colors.muted,
  },
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  section: {
    gap: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.ink,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  metricChip: {
    maxWidth: "100%",
  },
  sectionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteList: {
    gap: 10,
  },
  noteItem: {
    gap: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  noteTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  noteMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noteMeta: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  noteMenuWrap: {
    zIndex: 4,
  },
  noteMoreButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  noteMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
  },
  noteMenuLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  noteBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.ink,
  },
  restrictedCard: {
    gap: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  restrictedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  restrictedBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingVertical: 18,
    borderRadius: theme.radius.pill,
    ...theme.shadow.floating,
  },
  primaryButtonConnected: {
    backgroundColor: theme.colors.green,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
