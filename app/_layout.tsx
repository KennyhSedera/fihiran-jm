import { AppProvider, useApp } from "@/context/app-context";
import { DBProvider } from "@/context/db-context";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar, } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


function RootNavigator() {
  const { isDark } = useApp();

  return (
    <DBProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{ headerShown: false, }}
      />
    </DBProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <SQLiteProvider databaseName="fihirana_jm.db">
          <RootNavigator />
        </SQLiteProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
