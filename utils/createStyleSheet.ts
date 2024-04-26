import { lightTheme } from "@/theme";
import { StyleSheet } from "react-native";

export type Theme = typeof lightTheme;

export default function createStyleSheet<T extends StyleSheet.NamedStyles<any>>(createStyle: (value: Theme) => T) {
  return createStyle;
}