import { AppProvider, useApp } from "@/context/app-context";
import { DBProvider } from "@/context/db-context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

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

function CustomSplash() {
  const logoUrl = require("@/assets/images/icon2.png");

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      style={styles.splash}
    >
      <LinearGradient
        colors={["#cc0000", "#420000"] as const}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.centerContent} pointerEvents="none">
        <Image
          source={logoUrl}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {

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
    }, 3000);
    return () => clearTimeout(timeout);
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Suspense fallback={null}>
          <SQLiteProvider databaseName="fihirana_jm.db">
            <RootNavigator />
          </SQLiteProvider>
        </Suspense>

        {showCustomSplash && <CustomSplash />}
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    overflow: "hidden",
  },
  splashText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  centerContent: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: 220,
    height: 220,
  },
});