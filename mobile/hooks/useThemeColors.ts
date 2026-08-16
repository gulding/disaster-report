import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

export function useThemeColors() {
  const { isDark } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;
  return { ...themeColors, status: Colors.status };
}
