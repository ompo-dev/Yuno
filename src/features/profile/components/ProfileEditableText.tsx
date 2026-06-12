import { StyleProp, Text, TextInput, TextStyle } from "react-native";

import { theme } from "../../../theme";

interface ProfileEditableTextProps {
  inputAccessoryViewID?: string;
  isEditing: boolean;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  style: StyleProp<TextStyle>;
  textAlignVertical?: "auto" | "top" | "center" | "bottom";
  value: string;
}

export function ProfileEditableText({
  inputAccessoryViewID,
  isEditing,
  multiline = false,
  onChangeText,
  placeholder,
  style,
  textAlignVertical,
  value,
}: ProfileEditableTextProps) {
  if (!isEditing) {
    return <Text style={style}>{value}</Text>;
  }

  return (
    <TextInput
      inputAccessoryViewID={inputAccessoryViewID}
      multiline={multiline}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.muted}
      style={style}
      textAlignVertical={textAlignVertical}
      value={value}
    />
  );
}
