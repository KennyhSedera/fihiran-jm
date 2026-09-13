import { Caveat_400Regular, } from "@expo-google-fonts/caveat";
import { ComicNeue_400Regular, } from "@expo-google-fonts/comic-neue";
import { Kalam_400Regular, } from "@expo-google-fonts/kalam";
import { PatrickHand_400Regular, useFonts, } from "@expo-google-fonts/patrick-hand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState, } from "react";

export type ThemeMode = "light" | "dark" | "system";

export type FontChoice = "patrickHand" | "caveat" | "kalam" | "comicNeue";

export const FONT_FAMILY_MAP: Record<FontChoice, string> = {
  patrickHand: "PatrickHand_400Regular",
  caveat: "Caveat_400Regular",
  kalam: "Kalam_400Regular",
  comicNeue: "ComicNeue_400Regular",
};

export const FONT_LABELS: Record<FontChoice, string> = {
  patrickHand: "Patrick Hand",
  caveat: "Caveat",
  kalam: "Kalam",
  comicNeue: "Comic Neue",
};

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  fontSize: number;
  handleChangeFontSize: (value: number) => void;

  fontChoice: FontChoice;
  setFontChoice: (choice: FontChoice) => void;

  isDark: boolean;
  fontFamily?: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  theme: "@fihirana/theme",
  fontSize: "@fihirana/fontSize",
  fontChoice: "@fihirana/fontChoice",
};

const DEFAULT_FONT_CHOICE: FontChoice = "patrickHand";

function isFontChoice(value: string | null): value is FontChoice {
  return (
    value === "patrickHand" ||
    value === "caveat" ||
    value === "kalam" ||
    value === "comicNeue"
  );
}

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [fontSize, setFontSize] = useState(18);
  const [fontChoice, setFontChoiceState] = useState<FontChoice>(DEFAULT_FONT_CHOICE);
  const [systemDark, setSystemDark] = useState(false);

  const [fontsLoaded] = useFonts({
    PatrickHand_400Regular,
    Caveat_400Regular,
    Kalam_400Regular,
    ComicNeue_400Regular,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [
        savedTheme,
        savedFontSize,
        savedFontChoice,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.theme),
        AsyncStorage.getItem(STORAGE_KEYS.fontSize),
        AsyncStorage.getItem(STORAGE_KEYS.fontChoice),
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

      if (isFontChoice(savedFontChoice)) {
        setFontChoiceState(savedFontChoice);
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

  function handleChangeFontSize(fontSize: number) {
    changeFontSize(fontSize);
  }

  async function setFontChoice(choice: FontChoice) {
    setFontChoiceState(choice);

    await AsyncStorage.setItem(
      STORAGE_KEYS.fontChoice,
      choice
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" && systemDark);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      fontSize,
      handleChangeFontSize,
      fontChoice,
      setFontChoice,
      isDark,
      fontFamily: fontsLoaded
        ? FONT_FAMILY_MAP[fontChoice]
        : undefined,
    }),
    [
      theme,
      fontSize,
      fontChoice,
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