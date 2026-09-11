import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import hymnes from "@/assets/json/fihirana_jm.json";
import AnimatedHymnHeader from "@/components/animated-hymn-header";
import { useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { formatContent } from "@/utils/hymn.util";

export default function HymnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fontSize, isDark, fontFamily, favorites, toggleFavorite, } = useApp();

  const { hymn, prevHymn, nextHymn } = useMemo(() => {
    const list = hymnes as Hymn[];
    const idx = list.findIndex((item) => String(item.id) === String(id));

    return {
      hymn: idx !== -1 ? list[idx] : undefined,
      prevHymn: idx > 0 ? list[idx - 1] : null,
      nextHymn: idx !== -1 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  }, [id]);

  const goToHymn = (target: Hymn | null) => {
    if (!target) return;
    router.setParams({ id: String(target.id) });
  };

  const onSwipe = (event: any) => {
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
        <Ionicons name="alert-circle-outline" size={55} color="#8A95A2" />
        <Text style={styles.notFoundText}>
          Tsy hita ilay hira.
        </Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(`${hymn.id}`);
  const { bg, card, text, muted, } = useAppColors(isDark);

  const content = formatContent(hymn.content);

  return (
    <PanGestureHandler
      onHandlerStateChange={onSwipe}
      activeOffsetX={[-20, 20]}
      failOffsetY={[-15, 15]}
    >
      <View style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />

        <AnimatedHymnHeader
          onBack={() => router.back()}
          onToggleFavorite={() => toggleFavorite(hymn.id)}
          maxHeight={180}
          minHeight={45}
          insets={insets}
          backgroundColor={bg}
          isFavorite={isFavorite}
          title={hymn.title}
          number={hymn.number}
          category={hymn.category}
          keySig={hymn.keySig}
          cardBackgroundColor={card}
          textColor={text}
          mutedColor={muted}
          fontFamily={fontFamily}
          draggableButton={{ icon: "cog", onPress: () => router.push({ pathname: "/settings" }) }}
        >

          <View style={styles.reader}>
            <Text style={[styles.content, { color: text, fontSize, lineHeight: fontSize * 1.3, fontFamily, },]} >
              {content}
            </Text>

          </View>
        </AnimatedHymnHeader>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  toolbar: { height: 86, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, },
  toolbarLabel: { fontSize: 17 },
  controls: { flexDirection: "row", alignItems: "center", gap: 14 },
  fontButton: { width: 65, height: 58, borderRadius: 18, backgroundColor: "#E3E9EF", alignItems: "center", justifyContent: "center", },
  fontButtonText: { color: "#173253", fontSize: 21, fontWeight: "800" },
  fontSize: { width: 30, textAlign: "center", fontSize: 19 },
  reader: { paddingHorizontal: 26, paddingTop: 36 },
  content: { fontWeight: "400", textAlign: "center" },
  footer: { marginTop: 50, alignItems: "center" },
  line: { width: "94%", height: 1, marginBottom: 25 },
  footerTitle: { fontSize: 14, fontWeight: "600" },
  footerYear: { fontSize: 12, marginTop: 7 },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundText: { marginTop: 15, fontSize: 17, color: "#737D8A" },
});