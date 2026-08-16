import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const isDark = theme === 'system' ? deviceTheme === 'dark' : theme === 'dark';

  if (!isReady) {
    return null; // Avoid flicker
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
