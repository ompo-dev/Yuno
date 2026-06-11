import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "../theme";

interface ProfileDialogProps {
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  subtitle?: string;
  title: string;
  visible: boolean;
}

export function ProfileDialog({
  children,
  footer,
  onClose,
  subtitle,
  title,
  visible,
}: ProfileDialogProps) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardLayer}
        >
          <View style={styles.dialog}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            <View style={styles.body}>{children}</View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardLayer: {
    justifyContent: "center",
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadow.floating,
  },
  header: {
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.muted,
  },
  body: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    backgroundColor: "rgba(246,248,250,0.92)",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
});
