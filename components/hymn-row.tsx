import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { usePlayer } from "@/context/player-context";
import { useAppColors } from "@/hooks/use-color";
import { useOnline } from "@/hooks/use-online";
import { Hymn } from "@/types/hymn";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextStyle, ToastAndroid, TouchableOpacity, View } from "react-native";
import { ActionModal, ModalAction } from "./action-modal";
import { HighlightText } from "./highlight-text";

type HymnRowProps = {
  item: Hymn;
  search?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  handlePress?: () => void;
  isSearch?: boolean;
};

function renderHighlight(params: string, search: string, style: TextStyle = {}) {
  return <HighlightText text={params} highlight={search} textStyle={style} />;
}

export function HymnRow({ item, search, icon = "chevron-forward", iconColor, onPress, isSearch, handlePress }: HymnRowProps) {
  const { isDark, fontFamily } = useApp();
  const { card, text, muted, } = useAppColors(isDark);
  const { toggleLastRead, toggleLastSearch } = useDB();
  const [modalVisible, setModalVisible] = useState(false);

  function handleRowPress() {
    handlePress && handlePress();
    router.push({ pathname: "/hymn/[id]", params: { id: item.id } });
    toggleLastRead(item.id);
    (search || isSearch) && toggleLastSearch(item.id);
  }

  const isOnline = useOnline();
  const { playHymn, current, status, isDownloaded, download, removeDownload, downloading } = usePlayer();
  const isPlaying = current?.id === item.id && status.playing;

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

  const modalActions: ModalAction[] = isDownloaded(item.id)
    ? [
      { label: "Henoy", icon: "play-circle-outline", onPress: () => playHymn(item) },
      {
        label: "Fafao ny nalaina",
        icon: "trash-outline",
        destructive: true,
        onPress: () => removeDownload(item.id),
      },
    ]
    : [
      { label: "Henoy an-tserasera", icon: "wifi-outline", onPress: () => playHymn(item) },
      {
        label: "Alaina",
        icon: "cloud-download-outline",
        onPress: async () => {
          try {
            await download(item);
            ToastAndroid.show("Voaray ny hira.", ToastAndroid.SHORT);
          } catch {
            ToastAndroid.show("Tsy nahomby ny famakiana.", ToastAndroid.SHORT);
          }
        },
      },
    ];

  return (
    <View style={[styles.card, { backgroundColor: card },]} >
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.rowContent}
        onPress={handleRowPress}
      >
        <View style={[styles.number, { backgroundColor: isDark ? "#ffffff3b" : "#E6EDF5", },]} >
          <Text style={[styles.numberText, { color: isDark ? "#fff" : "#cc0000", },]} >
            {item.number}
          </Text>
        </View>

        <View style={styles.info}>
          <Text
            numberOfLines={1}
            style={[styles.hymnTitle, { color: text, fontFamily, },]}
          >
            {item.title} {(item.year !== "JM" && item.year > "2020") ? `(${item.year})` : null}
          </Text>

          <Text
            numberOfLines={2}
            style={[styles.category, { color: muted },]}
          >
            {search
              ? renderHighlight(item.content, search, { color: text, fontFamily, fontSize: 12, })
              : item.category}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handlePlayMusic(item)}
          style={{ padding: 5, borderRadius: 20, }}
        >
          <Ionicons name={!item.music ? "mic-off-sharp" : isPlaying ? "pause" : "headset"} size={18} color={muted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onPress}
          style={{ padding: 5, borderRadius: 20, }}
        >
          <Ionicons name={icon} size={20} color={iconColor || muted} />
        </TouchableOpacity>
      </View>
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`${item.number}. ${item.title}`}
        subtitle={isDownloaded(item.id) ? "Voaray ao amin'ny findainao" : "Safidio ny fomba"}
        actions={modalActions}
        bg={card}
        text={text}
        muted={muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 70, padding: 12, borderRadius: 17, marginBottom: 9, flexDirection: "row", alignItems: "center", },
  number: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#E6EDF5", alignItems: "center", justifyContent: "center", },
  numberText: { color: "#cc0000", fontWeight: "800", fontSize: 15 },
  info: { flex: 1, marginHorizontal: 13 },
  hymnTitle: { fontSize: 16, },
  category: { marginTop: 4, fontSize: 12 },
  rowContent: { flex: 1, flexDirection: "row", alignItems: "center", },
});