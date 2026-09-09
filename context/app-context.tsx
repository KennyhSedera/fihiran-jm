import {
  PatrickHand_400Regular,
  useFonts,
} from "@expo-google-fonts/patrick-hand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;

  favorites: string[];
  toggleFavorite: (id: string, year: string) => void;
  isFavorite: (id: string, year: string) => boolean;

  isDark: boolean;
  fontFamily?: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  theme: "@fihirana/theme",
  fontSize: "@fihirana/fontSize",
  favorites: "@fihirana/favorites",
};

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [fontSize, setFontSize] = useState(18);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [systemDark, setSystemDark] = useState(false);
  const [fontsLoaded] = useFonts({ PatrickHand_400Regular, });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [
        savedTheme,
        savedFontSize,
        savedFavorites,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.theme),
        AsyncStorage.getItem(STORAGE_KEYS.fontSize),
        AsyncStorage.getItem(STORAGE_KEYS.favorites),
      ]);

      if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
      ) {
        setThemeState(savedTheme);
      }

      if (savedFontSize) {
        const parsed = Number(savedFontSize);

        if (!Number.isNaN(parsed)) {
          setFontSize(parsed);
        }
      }

      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.log(
        "Erreur chargement paramètres:",
        error
      );
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const colorScheme =
        require("react-native").Appearance.getColorScheme();

      setSystemDark(colorScheme === "dark");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  async function setTheme(theme: ThemeMode) {
    setThemeState(theme);

    await AsyncStorage.setItem(
      STORAGE_KEYS.theme,
      theme
    );
  }

  async function changeFontSize(value: number) {
    const next = Math.min(
      32,
      Math.max(14, value)
    );

    setFontSize(next);

    await AsyncStorage.setItem(
      STORAGE_KEYS.fontSize,
      String(next)
    );
  }

  function increaseFontSize() {
    changeFontSize(fontSize + 2);
  }

  function decreaseFontSize() {
    changeFontSize(fontSize - 2);
  }

  async function toggleFavorite(id: string, year: string) {
    const key = `${id}_${year}`;

    const exists = favorites.includes(key);
    const next = exists
      ? favorites.filter((item) => item !== key)
      : [...favorites, key];

    setFavorites(next);

    await AsyncStorage.setItem(
      STORAGE_KEYS.favorites,
      JSON.stringify(next)
    );
  }

  function isFavorite(id: string, year: string) {
    return favorites.includes(`${id}_${year}`);
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" && systemDark);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      favorites,
      toggleFavorite,
      isFavorite,
      isDark,
      fontFamily: fontsLoaded
        ? "PatrickHand_400Regular"
        : undefined,
    }),
    [
      theme,
      fontSize,
      favorites,
      isDark,
      fontsLoaded,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp doit être utilisé dans AppProvider"
    );
  }

  return context;
}