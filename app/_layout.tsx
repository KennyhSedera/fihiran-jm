import { AppProvider, useApp } from "@/context/app-context";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootNavigator() {
  const { isDark } = useApp();

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: isDark
              ? "#101820"
              : "#F5F6F8",
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
}