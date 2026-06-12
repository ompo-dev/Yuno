import { StyleSheet, Text, View } from "react-native";

import { MotionPressable } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { useProfileEditorContext } from "../context";

interface ProfileHeroActionsProps {
  copy: AppCopy;
}

export function ProfileHeroActions({ copy }: ProfileHeroActionsProps) {
  const { actions, state } = useProfileEditorContext();

  return (
    <View style={styles.floatingActionWrap}>
      {state.isEditing ? (
        <View style={styles.headerActions}>
          <MotionPressable contentStyle={styles.headerGhost} onPress={actions.cancelEditing}>
            <Text style={styles.headerGhostLabel}>{copy.profile.cancel}</Text>
          </MotionPressable>
          <MotionPressable contentStyle={styles.headerPrimary} onPress={actions.saveEditing}>
            <Text style={styles.headerPrimaryLabel}>{copy.profile.done}</Text>
          </MotionPressable>
        </View>
      ) : (
        <MotionPressable contentStyle={styles.headerPrimary} onPress={actions.startEditing}>
          <Text style={styles.headerPrimaryLabel}>{copy.profile.edit}</Text>
        </MotionPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
