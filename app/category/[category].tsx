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
import { useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { SafeAreaView } from "react-native-safe-area-context";

const data = hymnes as Hymn[];

export default function CategoryScreen() {
  const router = useRouter();

  const { category } =
    useLocalSearchParams<{
      category: string;
    }>();

  const { isDark, fontFamily } = useApp();
  const { bg, card, text, muted, } = useAppColors(isDark);

  const decodedCategory =
    decodeURIComponent(category ?? "");

  const hymns = data
    .filter(
      (item) =>
        item.category === decodedCategory
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {decodedCategory}
          </Text>

          <Text style={styles.headerCount}>
            {hymns.length} hira
          </Text>
        </View>
      </View>

      <FlatList
        data={hymns}
        keyExtractor={(item) => `${item.id}_${item.year}`}
        contentContainerStyle={{
          padding: 20,
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
                  styles.title,
                  {
                    color: text,
                    fontFamily,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.meta,
                  { color: muted },
                ]}
              >
                {item.keySig}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={muted}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 80,
    backgroundColor: "#173253",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  back: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
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

  card: {
    minHeight: 70,
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

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  meta: {
    fontSize: 12,
    marginTop: 4,
  },
});