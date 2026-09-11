import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

import hymnes from "@/assets/json/fihirana_jm.json";
import AppHeader from "@/components/app-header";
import { HymnRow } from "@/components/hymn-row";
import { useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";

const data = hymnes as Hymn[];

export default function FavoritesScreen() {
  const { favorites, isDark, } = useApp();
  const { text, muted, } = useAppColors(isDark);

  const favoriteHymns = data
    .filter((item) => favorites.includes(`${item.id}`))
    .sort((a, b) => a.number - b.number);

  return (
    <AppHeader
      headerContent={
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: "#fff" }]}>
                Favoris
              </Text>
              <Text style={[styles.count, { color: "#d8d8d8" }]}>
                {favoriteHymns.length} chanson{favoriteHymns.length > 1 && "s"}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={20} color="#ffffff" />
            </View>
          </View>
        </View>
      }
    >
      <FlatList
        data={favoriteHymns}
        keyExtractor={(item) => `${item.id}_${item.year}`}
        contentContainerStyle={{
          padding: 6,
          paddingTop: 5,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (<HymnRow item={item} icon="heart" iconColor="#ff0000" />)}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={60} color="#A2ACB7" />

            <Text style={[styles.emptyTitle, { color: text },]} >
              Tsy mbola misy favoris
            </Text>

            <Text style={[styles.emptyText, { color: muted },]} >
              Tsindrio ❤️ rehefa mamaky hira.
            </Text>
          </View>
        }
      />
    </AppHeader>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  headerContainer: { flex: 1, flexDirection: "column", },
  header: { paddingTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  headerIcon: { width: 40, height: 40, borderRadius: 15, backgroundColor: "#e6edf59f", alignItems: "center", justifyContent: "center", },
  title: { fontSize: 28, fontWeight: "800", },
  count: { marginTop: 4, fontSize: 13, },
  empty: { alignItems: "center", paddingTop: 100, paddingHorizontal: 30, },
  emptyTitle: { fontSize: 19, fontWeight: "700", marginTop: 18, },
  emptyText: { fontSize: 14, marginTop: 7, textAlign: "center", },
});