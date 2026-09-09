import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import hymnes from "@/assets/json/fihirana_jm.json";
import { useApp } from "@/context/app-context";
import { Hymn } from "@/types/hymn";

function formatContent(content: string) {
  if (!content) return "";

  return content
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export default function HymnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    isDark,
    fontFamily,
    favorites,
    toggleFavorite,
  } = useApp();

  const { hymn, prevHymn, nextHymn } = useMemo(() => {
    const list = hymnes as Hymn[];
    const idx = list.findIndex(
      (item) => String(item.id) === String(id)
    );

    return {
      hymn: idx !== -1 ? list[idx] : undefined,
      prevHymn: idx > 0 ? list[idx - 1] : null,
      nextHymn:
        idx !== -1 && idx < list.length - 1
          ? list[idx + 1]
          : null,
    };
  }, [id]);

  const goToHymn = (target: Hymn | null) => {
    if (!target) return;
    router.setParams({ id: String(target.id) });
  };

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;

      if (translationX < -60) {
        goToHymn(nextHymn);
      } else if (translationX > 60) {
        goToHymn(prevHymn);
      }
    }
  };

  if (!hymn) {
    return (
      <View style={styles.notFound}>
        <Ionicons
          name="alert-circle-outline"
          size={55}
          color="#8A95A2"
        />

        <Text style={styles.notFoundText}>
          Tsy hita ilay hira.
        </Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(`${hymn.id}_${hymn.year}`);

  const bg = isDark
    ? "#101820"
    : "#F5F5F5";

  const card = isDark
    ? "#17212B"
    : "#FFFFFF";

  const text = isDark
    ? "#F5F7FA"
    : "#172033";

  const muted = isDark
    ? "#A1ADB8"
    : "#737D8A";

  const content = formatContent(
    hymn.content
  );

  return (
    <PanGestureHandler
      onHandlerStateChange={onGestureEvent}
      activeOffsetX={[-20, 20]}
      failOffsetY={[-15, 15]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: bg },
        ]}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {/* HEADER — remonte derrière la status bar */}

        <View
          style={[
            styles.header,
            { paddingTop: insets.top },
          ]}
        >
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={31}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            style={styles.headerTitle}
          >
            {hymn.number} - {hymn.title}
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              toggleFavorite(hymn.id, hymn.year)
            }
          >
            <Ionicons
              name={
                isFavorite
                  ? "heart"
                  : "heart-outline"
              }
              size={27}
              color={
                isFavorite
                  ? "#FF7080"
                  : "#FFFFFF"
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50 + insets.bottom,
          }}
        >

          <View style={styles.reader}>
            <Text
              style={[
                styles.content,
                {
                  color: text,
                  fontSize,
                  lineHeight:
                    fontSize * 1.25,
                  fontFamily,
                },
              ]}
            >
              {content}
            </Text>

            {/* FOOTER */}

            <View style={styles.footer}>
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: isDark
                      ? "#34414D"
                      : "#D5D9DE",
                  },
                ]}
              />

              <Text
                style={[
                  styles.footerTitle,
                  { color: muted },
                ]}
              >
                Fihirana Jesosy Mamonjy
              </Text>

              <Text
                style={[
                  styles.footerYear,
                  { color: muted },
                ]}
              >
                {hymn.year}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 72,
    backgroundColor: "#173253",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  headerButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginHorizontal: 8,
  },

  infoContainer: {
    padding: 28,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  numberBox: {
    width: 112,
    height: 112,
    borderRadius: 35,
    backgroundColor: "#173253",
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "500",
  },

  info: {
    flex: 1,
    marginLeft: 22,
  },

  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
  },

  category: {
    color: "#173253",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    marginTop: 8,
  },

  keySig: {
    fontSize: 16,
    marginTop: 7,
  },

  toolbar: {
    height: 86,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  toolbarLabel: {
    fontSize: 17,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  fontButton: {
    width: 65,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#E3E9EF",
    alignItems: "center",
    justifyContent: "center",
  },

  fontButtonText: {
    color: "#173253",
    fontSize: 21,
    fontWeight: "800",
  },

  fontSize: {
    width: 30,
    textAlign: "center",
    fontSize: 19,
  },

  reader: {
    paddingHorizontal: 26,
    paddingTop: 36,
  },

  content: {
    fontWeight: "400",
    textAlign: "center",
  },

  footer: {
    marginTop: 50,
    alignItems: "center",
  },

  line: {
    width: "94%",
    height: 1,
    marginBottom: 25,
  },

  footerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  footerYear: {
    fontSize: 14,
    marginTop: 7,
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFoundText: {
    marginTop: 15,
    fontSize: 17,
    color: "#737D8A",
  },
});