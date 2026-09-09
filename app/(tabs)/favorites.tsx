import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import hymnes from "@/assets/json/fihirana_jm.json";
import { useApp } from "@/context/app-context";
import { Hymn } from "@/types/hymn";
import { SafeAreaView } from "react-native-safe-area-context";

const data = hymnes as Hymn[];

export default function FavoritesScreen() {
  const {
    favorites,
    isDark,
    fontFamily,
  } = useApp();

  const bg = isDark ? "#101820" : "#F5F6F8";
  const card = isDark ? "#17212B" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#172033";
  const muted = isDark ? "#9BA8B4" : "#7D8795";

  const favoriteHymns = data
    .filter((item) =>
      favorites.includes(`${item.id}_${item.year}`)
    )
    .sort(
      (a, b) => a.number - b.number
    );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bg },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: text },
          ]}
        >
          Favoris
        </Text>

        <Text
          style={[
            styles.count,
            { color: muted },
          ]}
        >
          {favoriteHymns.length} hira
        </Text>
      </View>

      <FlatList
        data={favoriteHymns}
        keyExtractor={(item) => `${item.id}_${item.year}`}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 5,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: card },
            ]}
            onPress={() =>
              router.push({
                pathname: "/hymn/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <View style={styles.number}>
              <Text style={styles.numberText}>
                {item.number}
              </Text>
            </View>

            <View style={styles.info}>
              <Text
                style={[
                  styles.hymnTitle,
                  {
                    color: text,
                    fontFamily,
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.category,
                  { color: muted },
                ]}
              >
                {item.category}
              </Text>
            </View>

            <Ionicons
              name="heart"
              size={22}
              color="#E05267"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="heart-outline"
              size={60}
              color="#A2ACB7"
            />

            <Text
              style={[
                styles.emptyTitle,
                { color: text },
              ]}
            >
              Tsy mbola misy favoris
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: muted },
              ]}
            >
              Tsindrio ❤️ rehefa mamaky hira.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  count: {
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    minHeight: 72,
    borderRadius: 17,
    marginBottom: 9,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  number: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E6EDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: "#173253",
    fontWeight: "800",
  },

  info: {
    flex: 1,
    marginHorizontal: 13,
  },

  hymnTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  category: {
    fontSize: 12,
    marginTop: 4,
    textTransform: "capitalize",
  },

  empty: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 18,
  },

  emptyText: {
    fontSize: 14,
    marginTop: 7,
    textAlign: "center",
  },
});