import hymnes from "@/assets/json/fihirana_jm.json";
import { HymnRow } from "@/components/hymn-row";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import SearchBar from "@/components/search-bar";
import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const data = hymnes as Hymn[];

export default function HomeScreen() {
  const { isDark, fontFamily } = useApp();
  const [search, setSearch] = useState("");
  const { bgOverlay, card, text, muted, } = useAppColors(isDark);

  const { favorites, lastReads } = useDB();

  const categories = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean))
  ).sort();

  const renderHeader = (
    <View style={styles.imageHeader}>
      <View style={[styles.headerOverlay, { backgroundColor: bgOverlay, }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: "#e1e2e2" }, !isDark && { textTransform: "capitalize" }]} >
              Fihirana
            </Text>

            <Text style={[styles.appTitle, { color: "#ffffff", fontFamily, },]} >
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
        <View style={styles.search}>
          <SearchBar value={search} onChangeText={setSearch} dark={isDark} />
        </View>
      </View>
      <Image style={styles.imageHeader} source={require("@/assets/images/jma.jpg")} />
    </View>
  )
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: card, light: card }}
      headerImage={renderHeader}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
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
          contentContainerStyle={{ gap: 10, }}
        >
          {categories
            .slice(0, 8)
            .map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.category, { backgroundColor: card },]}
                onPress={() => router.push({ pathname: "/category/[category]", params: { category, }, })}
              >
                <Ionicons name="musical-note" size={18} color="#cc0000" />
                <Text style={[styles.categoryText, { color: text },]} >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {lastReads.length > 0 && <View style={[styles.sectionHeader, { marginTop: 30 },]} >
          <Text style={[styles.sectionTitle, { color: text },]} >
            Novakiana farany
          </Text>

          <TouchableOpacity onPress={() => router.push("/hymnes")} >
            <Text style={styles.seeAll}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>}

        {lastReads.map((hymn) => (<HymnRow key={hymn.id} item={hymn} icon="musical-note" />))}

        {favorites.length > 0 && <View style={[styles.sectionHeader, { marginTop: 30 },]} >
          <Text style={[styles.sectionTitle, { color: text },]} >
            Favoris
          </Text>

          <TouchableOpacity onPress={() => router.push("/favorites")} >
            <Text style={styles.seeAll}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>}

        {favorites.slice(0, 5).map((hymn) => (<HymnRow key={hymn.id} item={hymn} icon="heart" iconColor="#cc0000" />))}

        <Text style={[styles.sectionTitle, { marginTop: 30, color: text }]}>
          Info
        </Text>

        <View style={[styles.infoCard, { backgroundColor: card }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Version</Text>
            <Text style={[styles.infoValue, { color: text }]}>1.0.0</Text>
          </View>

          <View style={[styles.infoDivider, { backgroundColor: muted }]} />

          <Text style={[styles.infoApp, { color: text }]}>
            Fihirana Jesosy Mamonjy
          </Text>

          <Text style={[styles.infoAuthor, { color: muted }]}>
            Créé par Kennyh Sedera
          </Text>

          <Text style={[styles.infoCopyright, { color: muted }]}>
            © 2026
          </Text>

          <Text style={[styles.infoSlogan, { color: "#cc0000" }]}>
            "Vonnahitra ho an'Andriamanitra irery ihany"
          </Text>
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  content: { paddingBottom: 80, },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, },
  headerOverlay: { height: "100%", width: "100%", bottom: 0, left: 0, flexDirection: "column", justifyContent: "flex-end", position: 'absolute', zIndex: 1 },
  search: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 50 },
  imageHeader: { height: "100%", width: "100%", },
  greeting: { fontSize: 18, },
  appTitle: { fontSize: 32, fontWeight: "700", marginTop: 2, },
  logo: { width: 46, height: 46, borderRadius: 17, backgroundColor: "#cc0000", justifyContent: "center", alignItems: "center", },
  hero: { marginTop: 25, borderRadius: 28, padding: 25, backgroundColor: "#cc0000", },
  heroIcon: { width: 60, height: 60, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center", },
  heroTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "700", marginTop: 18, },
  heroDescription: { color: "#D8E2EC", fontSize: 14, lineHeight: 21, marginTop: 8, },
  heroButton: { marginTop: 22, height: 50, borderRadius: 15, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, },
  heroButtonText: { color: "#cc0000", fontSize: 15, fontWeight: "700", },
  stats: { flexDirection: "row", gap: 12, marginTop: 15, },
  statCard: { flex: 1, padding: 18, borderRadius: 18, },
  statNumber: { fontSize: 25, fontWeight: "800", },
  statLabel: { marginTop: 3, fontSize: 13, },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 13, },
  sectionTitle: { fontSize: 20, fontWeight: "800", },
  seeAll: { color: "#cc0000", fontWeight: "700", },
  category: { paddingHorizontal: 16, height: 45, borderRadius: 15, flexDirection: "row", alignItems: "center", gap: 7, },
  categoryText: { fontSize: 13, fontWeight: "600", textTransform: "capitalize", },
  hymnCard: { padding: 13, borderRadius: 17, flexDirection: "row", alignItems: "center", marginBottom: 9, gap: 12, },
  hymnNumber: { width: 45, height: 45, borderRadius: 14, backgroundColor: "#E5ECF4", justifyContent: "center", alignItems: "center", },
  hymnNumberText: { color: "#cc0000", fontWeight: "800", },
  hymnTitle: { fontSize: 16, fontWeight: "700", },
  card: { minHeight: 70, padding: 12, borderRadius: 17, marginBottom: 9, flexDirection: "column", alignItems: "center", },
  hymnCategory: { fontSize: 12, marginTop: 3, textTransform: "capitalize", },
  infoCard: { padding: 4, borderRadius: 17, },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", padding: 16, },
  infoLabel: { fontSize: 15, fontWeight: "600", },
  infoValue: { fontSize: 15, fontWeight: "700", },
  infoDivider: { height: 1, opacity: 0.15, marginHorizontal: 16, },
  infoApp: { fontSize: 15, fontWeight: "700", textAlign: "center", marginTop: 14, textTransform: "uppercase" },
  infoAuthor: { fontSize: 13, textAlign: "center", marginTop: 4, },
  infoCopyright: { fontSize: 12, textAlign: "center", marginTop: 4, marginBottom: 14, },
  infoSlogan: { fontSize: 13, textAlign: "center", marginTop: 4, marginBottom: 14, fontStyle: "italic", },
});