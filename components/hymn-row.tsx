import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";
import { HighlightText } from "./highlight-text";

type HymnRowProps = {
  item: Hymn;
  search?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
};

function renderHighlight(params: string, search: string, style: TextStyle = {}) {
  return <HighlightText text={params} highlight={search} textStyle={style} />;
}

export function HymnRow({ item, search, icon = "chevron-forward", iconColor }: HymnRowProps) {
  const { isDark, fontFamily } = useApp();
  const { card, text, muted, } = useAppColors(isDark);
  const { toggleLastRead } = useDB();
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: card }]}
      onPress={() => {
        router.push({ pathname: "/hymn/[id]", params: { id: item.id } });
        toggleLastRead(item.id);
      }}
    >
      <View style={[styles.number, { backgroundColor: isDark ? "#ffffff3b" : "#E6EDF5" }]}>
        <Text style={[styles.numberText, { color: isDark ? "#fff" : "#cc0000" }]}>{item.number}</Text>
      </View>

      <View style={styles.info}>
        <Text
          numberOfLines={2}
          style={[styles.hymnTitle, { color: text, fontFamily }]}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          style={[styles.category, { color: muted }, !search && { textTransform: "capitalize" },]}
        >
          {search
            ? renderHighlight(item.content, search, {
              color: text,
              fontFamily,
              fontSize: 12,
            })
            : item.category}
        </Text>
      </View>

      <Ionicons name={icon} size={20} color={iconColor || muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 70, padding: 12, borderRadius: 17, marginBottom: 9, flexDirection: "row", alignItems: "center", },
  number: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#E6EDF5", alignItems: "center", justifyContent: "center", },
  numberText: { color: "#cc0000", fontWeight: "800", fontSize: 15 },
  info: { flex: 1, marginHorizontal: 13 },
  hymnTitle: { fontSize: 16, fontWeight: "700" },
  category: { marginTop: 4, fontSize: 12 },
});