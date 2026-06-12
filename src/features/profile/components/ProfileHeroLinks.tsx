import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { SocialLinkPill } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { useProfileEditorContext } from "../context";

interface ProfileHeroLinksProps {
  copy: AppCopy;
}

export function ProfileHeroLinks({ copy }: ProfileHeroLinksProps) {
  const { actions, derived, state } = useProfileEditorContext();

  return (
    <View style={styles.linkGroup}>
      {derived.socialLinks.map((link) => (
        <SocialLinkPill
          key={`${link.provider}-${link.value}`}
          link={link}
          onPress={state.isEditing ? () => actions.openEditLinkDialog(link.provider) : undefined}
        />
      ))}

      {state.isEditing ? (
        <InfoChip icon="add" label={copy.profile.addLink} onPress={actions.openCreateLinkDialog} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  linkGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
