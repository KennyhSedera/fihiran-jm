import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { LinearGradient } from "expo-linear-gradient";

type TabBarProps = NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]> extends (
  props: infer P
) => any
  ? P
  : never;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  hymnes: "book",
  favorites: "heart",
  settings: "settings",
};

const LABELS: Record<string, string> = {
  index: "Accueil",
  hymnes: "Fihirana",
  favorites: "Favoris",
  settings: "Paramètres",
};

export default function CustomTabBar({
  state,
  navigation,
}: TabBarProps) {
  const { isDark } = useApp();
  const insets = useSafeAreaInsets();
  const { card, border, inactiveColor } = useAppColors(isDark);

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <LinearGradient
        colors={["#cc0000", isDark ? "#6e0000" : "#ff7171"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.bar, { backgroundColor: card, borderColor: border }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = ICONS[route.name] ?? "ellipse";
          const label = LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              icon={icon}
              label={label}
              isFocused={isFocused}
              inactiveColor={inactiveColor}
              onPress={onPress}
            />
          );
        })}
      </LinearGradient>
    </View>
  );
}

type TabButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isFocused: boolean;
  inactiveColor: string;
  onPress: () => void;
};

function TabButton({
  icon,
  label,
  isFocused,
  inactiveColor,
  onPress,
}: TabButtonProps) {
  const pillStyle = useAnimatedStyle(() => ({
    width: withTiming(isFocused ? 90 : 50, { duration: 220 }),
    backgroundColor: withTiming(isFocused ? "#ffffff" : "transparent", {
      duration: 220,
    }),
  }));

  const { isDark } = useApp();

  const labelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0, { duration: 150 }),
    width: withTiming(isFocused ? "auto" : 0, { duration: 220 }),
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        <Ionicons
          name={isFocused ? icon : (`${icon}-outline` as any)}
          size={22}
          color={isFocused ? isDark ? "#6e0000" : "#cc0000" : inactiveColor}
        />

        {isFocused && (
          <Animated.Text
            numberOfLines={1}
            style={[styles.label, { color: isDark ? "#6e0000" : "#cc0000" }, labelStyle]}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e00000a2",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    height: 44,
    borderRadius: 22,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  label: {
    color: "#6e0000",
    fontSize: 11,
    fontWeight: "700",
  },
});