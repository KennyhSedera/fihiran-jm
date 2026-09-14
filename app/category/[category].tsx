import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import hymnes from "@/assets/json/fihirana_jm.json";
import AppHeader from "@/components/app-header";
import { HymnRow } from "@/components/hymn-row";
import { useDB } from "@/context/db-context";
import { getMainCategory, Hymn } from "@/types/hymn";

const data = hymnes as Hymn[];

export default function CategoryScreen() {
  const router = useRouter();
  const { isFavorite } = useDB();

  const { category } = useLocalSearchParams<{
    category: string;
  }>();

  const decodedCategory = decodeURIComponent(category ?? "");

  /**
   * On transforme chaque catégorie originale
   * en catégorie principale avant de filtrer.
   */
  const hymns = data
    .filter(
      (item) => getMainCategory(item.category) === decodedCategory
    )
    .sort((a, b) => a.number - b.number);

  return (
    <AppHeader
      headerContent={
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.back}
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
            >
              {decodedCategory}
            </Text>

            <Text style={styles.headerCount}>
              {hymns.length}{" "}
              {hymns.length > 1 ? "chants" : "chant"}
            </Text>
          </View>
        </View>
      }
    >
      <FlatList
        data={hymns}
        keyExtractor={(item) => `${item.id}_${item.year}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const favorite = isFavorite(item.id);

          return (
            <HymnRow
              item={item}
              icon={favorite ? "heart" : undefined}
              iconColor={favorite ? "#cc0000" : undefined}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="musical-notes-outline"
              size={48}
              color="#9BA8B4"
            />

            <Text style={styles.emptyTitle}>
              Aucun chant
            </Text>

            <Text style={styles.emptyText}>
              Aucun chant ne correspond à cette catégorie.
            </Text>
          </View>
        }
      />
    </AppHeader>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  headerCount: {
    color: "#C9D6E3",
    marginTop: 2,
  },

  list: {
    padding: 10,
    paddingBottom: 40,
  },

  empty: {
    paddingTop: 80,
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "700",
    color: "#7D8795",
  },

  emptyText: {
    marginTop: 6,
    textAlign: "center",
    color: "#9BA8B4",
  },
});