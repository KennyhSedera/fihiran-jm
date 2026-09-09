import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import hymnes from "@/assets/json/fihirana_jm.json";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useApp } from "@/context/app-context";
import { Hymn } from "@/types/hymn";

const data = hymnes as Hymn[];

export default function HomeScreen() {
  const { isDark, fontFamily } = useApp();

  const bg = isDark ? "#101820" : "#F5F6F8";
  const card = isDark ? "#17212B" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#172033";
  const muted = isDark ? "#A3AFBA" : "#7A8495";

  const categories = Array.from(
    new Set(
      data
        .map((item) => item.category)
        .filter(Boolean)
    )
  ).sort();

  const firstHymns = [...data]
    .slice(0, 5)
    .sort((a, b) => a.number - b.number);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "red", light: "blue" }}
      headerImage={
        <View style={styles.imageHeader}>
          <View style={styles.headerOverlay}>
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.greeting,
                    { color: muted },
                  ]}
                >
                  Fihirana
                </Text>

                <Text
                  style={[
                    styles.appTitle,
                    {
                      color: text,
                      fontFamily,
                    },
                  ]}
                >
                  Jesosy Mamonjy
                </Text>
              </View>

              <View style={styles.logo}>
                <Image
                  style={styles.logo}
                  source={require("@/assets/images/images.jpg")}
                />
              </View>
            </View>
          </View>
          <Image style={styles.imageHeader} source={require("@/assets/images/jma.jpg")} />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* STATISTIQUES */}

        <View style={styles.stats}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: card },
            ]}
          >
            <Text
              style={[
                styles.statNumber,
                { color: text },
              ]}
            >
              {data.length}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: muted },
              ]}
            >
              Hira
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: card },
            ]}
          >
            <Text
              style={[
                styles.statNumber,
                { color: text },
              ]}
            >
              {categories.length}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: muted },
              ]}
            >
              Sokajy
            </Text>
          </View>
        </View>

        {/* CATEGORIES */}

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: text },
            ]}
          >
            Sokajy
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/hymnes")
            }
          >
            <Text style={styles.seeAll}>
              Hijery rehetra
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          {categories
            .slice(0, 8)
            .map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.category,
                  { backgroundColor: card },
                ]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/category/[category]",
                    params: {
                      category,
                    },
                  })
                }
              >
                <Ionicons
                  name="musical-note"
                  size={18}
                  color="#cc0000"
                />

                <Text
                  style={[
                    styles.categoryText,
                    { color: text },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* PREMIERS HYMNS */}

        <View
          style={[
            styles.sectionHeader,
            { marginTop: 30 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: text },
            ]}
          >
            Premiers hira
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/hymnes")
            }
          >
            <Text style={styles.seeAll}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>

        {firstHymns.map((hymn) => (
          <TouchableOpacity
            key={hymn.id}
            style={[
              styles.hymnCard,
              { backgroundColor: card },
            ]}
            onPress={() =>
              router.push({
                pathname: "/hymn/[id]",
                params: {
                  id: hymn.id,
                },
              })
            }
          >
            <View style={styles.hymnNumber}>
              <Text style={styles.hymnNumberText}>
                {hymn.number}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.hymnTitle,
                  {
                    color: text,
                    fontFamily,
                  },
                ]}
              >
                {hymn.title}
              </Text>

              <Text
                style={[
                  styles.hymnCategory,
                  { color: muted },
                ]}
              >
                {hymn.category}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={muted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerOverlay: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    flexDirection: "column",
    justifyContent: "center",
    position: 'absolute',
    backgroundColor: "#00000080",
    zIndex: 1
  },

  imageHeader: {
    height: "100%",
    width: "100%",
  },

  greeting: {
    fontSize: 14,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 2,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "#cc0000",
    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    marginTop: 25,
    borderRadius: 28,
    padding: 25,
    backgroundColor: "#cc0000",
  },

  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
    marginTop: 18,
  },

  heroDescription: {
    color: "#D8E2EC",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  heroButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  heroButtonText: {
    color: "#cc0000",
    fontSize: 15,
    fontWeight: "700",
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },

  statCard: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  seeAll: {
    color: "#cc0000",
    fontWeight: "700",
  },

  category: {
    paddingHorizontal: 16,
    height: 45,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  hymnCard: {
    padding: 13,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
    gap: 12,
  },

  hymnNumber: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#E5ECF4",
    justifyContent: "center",
    alignItems: "center",
  },

  hymnNumberText: {
    color: "#cc0000",
    fontWeight: "800",
  },

  hymnTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  hymnCategory: {
    fontSize: 12,
    marginTop: 3,
    textTransform: "capitalize",
  },
});