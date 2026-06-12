import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { resolveLocalizedText } from "../../../i18n";
import { theme } from "../../../theme";
import { InfoChip, InitialsAvatar, MotionPressable } from "../../../components/atoms";
import { useEncounterDetailContext } from "../context";

export function EncounterDetailHero() {
  const { actions, derived, props } = useEncounterDetailContext();

  if (!derived.activeEncounter) {
    return null;
  }

  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <InitialsAvatar
          gradient={derived.activeEncounter.gradient}
          imageUrl={derived.activeEncounter.avatarUrl}
          initials={derived.activeEncounter.initials}
          size={72}
        />

        <View style={styles.heroMeta}>
          <View style={styles.heroTitleRow}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>{derived.activeEncounter.name}</Text>
              {derived.activeEncounter.verified ? (
                <Ionicons
                  color={theme.colors.blue}
                  name="checkmark-circle"
                  size={16}
                />
              ) : null}
            </View>

            <View
              collapsable={false}
              ref={actions.setHeaderMenuAnchor}
              style={styles.headerMenuWrap}
            >
              <MotionPressable
                contentStyle={styles.moreButton}
                onPress={actions.toggleHeaderMenu}
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
            {resolveLocalizedText(derived.activeEncounter.role, props.language)}{" "}
            {props.copy.common.at} {derived.activeEncounter.company}
          </Text>
        </View>
      </View>

      <View style={styles.heroTags}>
        <InfoChip
          icon="people-outline"
          label={resolveLocalizedText(derived.activeEncounter.event, props.language)}
          onPress={actions.openEncounterEvent}
          tone={derived.eventTone}
        />
        <InfoChip
          icon="git-network-outline"
          label={props.copy.detail.totalConnections(derived.activeEncounter.connectionCount)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
