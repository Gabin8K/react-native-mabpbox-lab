import theme from "@/theme";
import { useColorScheme } from "react-native";

export default function useTheme() {
  const schema = useColorScheme() ?? 'light';

  const value = schema === 'light' ? theme.lightTheme : theme.darkTheme;

  return {
    value,
    mode: schema
  }
}