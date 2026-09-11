import { AppProvider, useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

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
            backgroundColor: isDark ? "#101820" : "#F5F6F8",
          },
        }}
      />
    </>
  );
}

function CustomSplash() {
  const { isDark } = useApp();
  const { bg } = useAppColors(isDark);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      style={[styles.splash, { backgroundColor: bg }]}
    >
      <Image
        source={require("@/assets/images/images.jpg")}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (!appReady) return;

    SplashScreen.hideAsync();

    const timeout = setTimeout(() => {
      setShowCustomSplash(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [appReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
        {showCustomSplash && <CustomSplash />}
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  splashImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
});