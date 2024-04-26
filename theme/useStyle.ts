import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/utils/createStyleSheet";

export default function useStyle<T extends StyleSheet.NamedStyles<any>>(style: (theme: Theme) => T) {
  const { value } = useTheme();
  const styles = style(value);

  return {
    value,
    style: StyleSheet.create(styles),
  };
}