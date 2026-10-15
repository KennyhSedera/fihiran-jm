import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";
import {
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionModal, ModalAction } from "@/components/action-modal";
import AnimatedHymnHeader from "@/components/animated-hymn-header";
import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { usePlayer } from "@/context/player-context";
import { useAppColors } from "@/hooks/use-color";
import { useOnline } from "@/hooks/use-online";
import { Hymn } from "@/types/hymn";
import { parseHymnContent } from "@/utils/hymn.util";

export default function HymnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fontSize, isDark, fontFamily } = useApp();

  const [modalVisible, setModalVisible] = useState(false);

  const { hymns, isFavorite, toggleFavorite } = useDB();

  const { hymn, prevHymn, nextHymn } = useMemo(() => {
    const idx = hymns.findIndex((item) => String(item.id) === String(id));

    return {
      hymn: idx !== -1 ? hymns[idx] : undefined,
      prevHymn: idx > 0 ? hymns[idx - 1] : null,
      nextHymn: idx !== -1 && idx < hymns.length - 1 ? hymns[idx + 1] : null,
    };
  }, [hymns, id]);

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

  const isOnline = useOnline();
  const { playHymn, current, status, isDownloaded, download, removeDownload, downloading } = usePlayer();
  const isPlaying = current?.id === hymn.id && status.playing;

  function handlePlayMusic(item: Hymn) {
    const dl = isDownloaded(item.id);

    if (!dl && !item.music) {
      return ToastAndroid.show("Mbola tsy misy hira.", ToastAndroid.SHORT);
    }
    if (!dl && !isOnline) {
      return ToastAndroid.show("Tsy misy internet.", ToastAndroid.SHORT);
    }
    setModalVisible(true);
  }

  const modalActions: ModalAction[] = isDownloaded(hymn.id)
    ? [
      { label: "Henoy", icon: "play-circle-outline", onPress: () => playHymn(hymn) },
      {
        label: "Fafao ny nalaina",
        icon: "trash-outline",
        destructive: true,
        onPress: () => removeDownload(hymn.id),
      },
    ]
    : [
      { label: "Henoy an-tserasera", icon: "wifi-outline", onPress: () => playHymn(hymn) },
      {
        label: "Alaina",
        icon: "cloud-download-outline",
        onPress: async () => {
          try {
            await download(hymn);
            ToastAndroid.show("Voaray ny hira.", ToastAndroid.SHORT);
          } catch {
            ToastAndroid.show("Tsy nahomby ny famakiana.", ToastAndroid.SHORT);
          }
        },
      },
    ];

  const { bg, card, text, muted, } = useAppColors(isDark);
  const blocks = useMemo(() => parseHymnContent(hymn.content), [hymn.content]);

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
          maxHeight={140}
          minHeight={45}
          insets={insets}
          backgroundColor={bg}
          isFavorite={isFavorite(hymn.id)}
          title={hymn.title}
          number={hymn.number}
          category={hymn.category}
          keySig={hymn.keySig}
          year={hymn.year}
          cardBackgroundColor={card}
          textColor={text}
          mutedColor={muted}
          fontFamily={fontFamily}
          draggableButton={{
            icon: !hymn.music ? "mic-off-sharp" : isPlaying ? "pause" : "headset",
            onPress: () => handlePlayMusic(hymn)
          }}
        >
          <View style={styles.reader}>
            {blocks.map((block, idx) => {
              return (
                <Text
                  key={idx}
                  style={[
                    styles.content,
                    { color: text, fontSize, lineHeight: fontSize * 1.3, fontFamily, marginBottom: fontSize * 1.2 },
                  ]}
                >
                  {block.label && (
                    <Text
                      style={[
                        styles.content,
                        { color: "#cc0000", fontSize: fontSize - 2, lineHeight: fontSize * 1.3, fontFamily },
                      ]}
                    >
                      {block.label && block.label + "\n"}
                    </Text>
                  )}

                  {block.kind === "verse" && (
                    <Text
                      style={[styles.content, { color: "#cc0000", fontSize, lineHeight: fontSize * 1.3, fontFamily },]}
                    >
                      {`${block.number}. `}
                    </Text>
                  )}

                  {block.text}
                </Text>
              );
            })}
          </View>
        </AnimatedHymnHeader>
        <ActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={`${hymn.number}. ${hymn.title}`}
          subtitle={isDownloaded(hymn.id) ? "Voaray ao amin'ny findainao" : "Safidio ny fomba"}
          actions={modalActions}
          bg={card}
          text={text}
          muted={muted}
        />
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