import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useApp } from "@/context/app-context";
import { StatusBar } from "react-native";

export default function TabsLayout() {
  const { isDark } = useApp();

  const backgroundColor = isDark
    ? "#17212B"
    : "#FFFFFF";

  const activeColor = "#173253";

  const inactiveColor = isDark
    ? "#7E8B98"
    : "#929BA8";

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor,
            borderTopColor: isDark
              ? "#26323D"
              : "#E4E7EB",
          },

          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",

            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="hymnes"
          options={{
            title: "Fihirana",

            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="book"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favoris",

            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="heart"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Paramètres",

            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="settings"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}