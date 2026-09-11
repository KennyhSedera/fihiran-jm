import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

import CustomTabBar from "@/components/custom-tab-bar";
import { useApp } from "@/context/app-context";

export default function TabsLayout() {
  const { isDark } = useApp();

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Accueil" }} />
        <Tabs.Screen name="hymnes" options={{ title: "Chansons" }} />
        <Tabs.Screen name="favorites" options={{ title: "Favoris" }} />
        <Tabs.Screen name="settings" options={{ title: "Paramètres" }} />
      </Tabs>
    </>
  );
}