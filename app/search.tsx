import AppHeader from "@/components/app-header";
import { HymnRow } from "@/components/hymn-row";
import SearchBar from "@/components/search-bar";
import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { searchHymn } from "@/utils/hymn.util";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchScreen() {
  const { isDark } = useApp();
  const { text, muted } = useAppColors(isDark);
  const { favorites, hymns, lastSearch, removeLastSearch } = useDB();
  const [showYear, setShowYear] = useState(false);
  const [maxHeight, setMaxHeight] = useState(110);
  const [selectedYear, setSelectedYear] = useState<string | null>("all");
  const [search, setSearch] = useState("");

  const isSearching = !!search.trim();

  function getAllYear(hymns: Hymn[]): string[] {
    return [...new Set(hymns.map((hymn) => hymn.year))];
  }

  const flatResults = useMemo(() => {
    if (!isSearching) {
      return lastSearch;
    }

    const source =
      selectedYear === "all"
        ? hymns
        : hymns.filter(
          (hymn) => hymn.year === selectedYear
        );

    return searchHymn(
      search.trim().toLowerCase(),
      source
    );
  }, [search, isSearching, selectedYear, lastSearch, hymns,]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const keyExtractor = useCallback((item: Hymn) => `${item.id}_${item.year}`, []);

  const renderItem = useCallback(
    ({ item }: { item: Hymn }) => {

      return (
        <HymnRow
          item={item}
          search={search}
          icon={!isSearching ? "trash-outline" : "chevron-forward"}
          iconColor={!isSearching ? "#cc0000" : undefined}
          isSearch={true}
          onPress={!isSearching ? () => removeLastSearch(item.id) : undefined}
          handlePress={() => setSearch("")}
        />
      );
    },
    [search, favoriteIds]
  );

  const handleSelectYear = (year: string) => {
    setSelectedYear((current) => (current === year ? null : year));
  };

  const headerRender = (
    <View style={styles.headerContainer}>
      <View style={styles.header} >
        <Ionicons
          onPress={() => {
            setSearch("");
            router.back();
          }} name="chevron-back"
          size={30}
          color="white"
        />

        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity style={{ marginHorizontal: 10 }} activeOpacity={0.6} onPress={() => { setMaxHeight(showYear ? 110 : 180); setShowYear(!showYear) }}>
          <Ionicons name={showYear ? "close" : "filter-sharp"} size={24} color="#fff" />
          <Text style={[styles.filterText, { color: "#fff" }]}>{selectedYear === "all" ? "Tous" : selectedYear}</Text>
        </TouchableOpacity>
      </View>

      {showYear && <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.yearScroll}
        contentContainerStyle={styles.yearScrollContent}
      >
        {getAllYear(hymns).map((year) => {
          const all = year === "JM";
          const isActive = selectedYear === (!all ? year : "all");
          return (
            <TouchableOpacity
              key={year}
              activeOpacity={0.75}
              onPress={() => handleSelectYear(year === "JM" ? "all" : year)}
              style={[styles.year, isActive && styles.yearActive]}
            >
              <Text style={[styles.yearText, { color: isActive ? "#cc0000" : "#ffffff" },]} >
                {year === "JM" ? "Tous" : year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>}

    </View>
  );

  const data = !isSearching ? flatResults : flatResults.sort((a, b) => Number(a.id) - Number(b.id));

  return (
    <AppHeader headerContent={headerRender} height={maxHeight}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 40,
        }}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={30}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          isSearching ? (
            <View style={{ alignItems: "center", paddingTop: 70, }} >
              <Ionicons name="search-outline" size={50} color={muted} />
              <Text style={{ color: muted, marginTop: 5, }} >
                Tsy nahitana valiny.
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingTop: 70, }} >
              <Ionicons name="search-outline" size={50} color={muted} />
              <Text style={{ color: text, fontSize: 18, fontWeight: "700", marginTop: 15, }} >
                Tsy misy hira nokarohina.
              </Text>
              <Text style={{ color: muted, marginTop: 5, }} >
                Atombohy ny fikarohanao.
              </Text>
            </View>
          )
        }
      />
    </AppHeader>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flex: 1, flexDirection: "column", paddingTop: 20, },
  header: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5, },
  yearScroll: { marginTop: 16, marginHorizontal: 10, },
  yearScrollContent: { flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 10 },
  year: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#ffffff26", },
  yearActive: { backgroundColor: "#ffffff", },
  yearText: { fontSize: 14, fontWeight: "700" },
  filterText: { fontSize: 11, fontWeight: "700", textAlign: "center" },
}); 