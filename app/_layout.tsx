import { MiniPlayer } from "@/components/mini-player";
import { AppProvider, useApp } from "@/context/app-context";
import { DBProvider } from "@/context/db-context";
import { PlayerProvider } from "@/context/player-context";
import { Stack, useSegments } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar, } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function RootNavigator() {
  const { isDark } = useApp();
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const onTabs = (segments[0] as string) === "(tabs)";
  const TAB_BAR_HEIGHT = 70;
  const playerBottom = insets.bottom + (onTabs ? TAB_BAR_HEIGHT : 10);

  return (
    <DBProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <Stack screenOptions={{ headerShown: false }} />

      <MiniPlayer
        bottom={playerBottom}
        bg={isDark ? "#1e1e1e" : "#fff"}
        text={isDark ? "#fff" : "#222"}
      />
    </DBProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <SQLiteProvider databaseName="fihirana_jm.db">
          <PlayerProvider>
            <RootNavigator />
          </PlayerProvider>
        </SQLiteProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
