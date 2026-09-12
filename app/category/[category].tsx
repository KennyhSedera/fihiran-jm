import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter
} from "expo-router";
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
import { Hymn } from "@/types/hymn";

const data = hymnes as Hymn[];

export default function CategoryScreen() {
  const router = useRouter();
  const { isFavorite } = useDB();
  const { category } = useLocalSearchParams<{ category: string; }>();
  const decodedCategory = decodeURIComponent(category ?? "");

  const hymns = data
    .filter((item) => item.category === decodedCategory)
    .sort((a, b) => a.number - b.number);

  return (
    <AppHeader
      headerContent={
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {decodedCategory}
            </Text>

            <Text style={styles.headerCount}>
              {hymns.length} chanson{hymns.length > 1 && "s"}
            </Text>
          </View>
        </View>
      }
    >
      <FlatList
        data={hymns}
        keyExtractor={(item) => `${item.id}_${item.year}`}
        contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (<HymnRow item={item} icon={isFavorite(item.id) ? "heart" : undefined} iconColor={isFavorite(item.id) ? "#cc0000" : ""} />)}
      />
    </AppHeader>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  header: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10, },
  back: { alignItems: "center", justifyContent: "center", },
  headerTitle: { color: "#FFFFFF", fontSize: 23, fontWeight: "700", textTransform: "capitalize", },
  headerCount: { color: "#C9D6E3", marginTop: 2, },
  card: { minHeight: 70, borderRadius: 17, marginBottom: 9, padding: 12, flexDirection: "row", alignItems: "center", },
  number: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#E6EDF5", alignItems: "center", justifyContent: "center", },
  numberText: { color: "#173253", fontWeight: "800", },
  info: { flex: 1, marginHorizontal: 13, },
  title: { fontSize: 16, fontWeight: "700", },
  meta: { fontSize: 12, marginTop: 4, },
});