import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { theme } from "../../../theme";
import { MotionPressable } from "../../../components/atoms";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailFloatingMenu() {
  const { width: windowWidth } = useWindowDimensions();
  const { actions, derived, props } = useEncounterDetailContext();

  if (!derived.activeMenu) {
    return null;
  }

  const noteMenu = derived.activeMenu.type === "note" ? derived.activeMenu : null;

  return (
    <View pointerEvents="box-none" style={styles.overlayLayer}>
      <Pressable onPress={actions.dismissMenus} style={styles.menuBackdrop} />
      <View
        style={[
          styles.floatingMenu,
          {
            right: Math.max(
              18,
              windowWidth - derived.activeMenu.anchor.x - derived.activeMenu.anchor.width,
            ),
            top: derived.activeMenu.anchor.y + derived.activeMenu.anchor.height + 8,
          },
        ]}
      >
        {derived.activeMenu.type === "header" ? (
          <MotionPressable
            contentStyle={styles.menuItem}
            onPress={actions.dismissMenus}
            pressScale={0.98}
          >
            <Ionicons color={theme.colors.ink} name="ban-outline" size={16} />
            <Text style={styles.menuLabel}>{props.copy.detail.block}</Text>
          </MotionPressable>
        ) : (
          <>
            <MotionPressable
              contentStyle={styles.menuItem}
              onPress={() => noteMenu && actions.editNote(noteMenu.note)}
              pressScale={0.98}
            >
              <Ionicons color={theme.colors.ink} name="create-outline" size={15} />
              <Text style={styles.menuLabel}>{props.copy.notes.editNote}</Text>
            </MotionPressable>
            <MotionPressable
              contentStyle={styles.menuItem}
              onPress={() => noteMenu && actions.deleteNote(noteMenu.note.id)}
              pressScale={0.98}
            >
              <Ionicons color={theme.colors.ink} name="trash-outline" size={15} />
              <Text style={styles.menuLabel}>{props.copy.notes.deleteNote}</Text>
            </MotionPressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingMenu: {
    position: "absolute",
    minWidth: 148,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ink,
  },
});
