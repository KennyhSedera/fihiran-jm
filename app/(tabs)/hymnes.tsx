import { Ionicons } from "@expo/vector-icons";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import hymnes from "@/assets/json/fihirana_jm.json";
import AnimatedHeader from "@/components/animate-header";
import { HymnRow } from "@/components/hymn-row";
import SearchBar from "@/components/search-bar";
import { useApp } from "@/context/app-context";
import { useDB } from "@/context/db-context";
import { useAppColors } from "@/hooks/use-color";
import { Hymn } from "@/types/hymn";
import { searchHymn } from "@/utils/hymn.util";

const data = hymnes as Hymn[];

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<Hymn>);

type HymnSection = {
  title: string;
  data: Hymn[];
};

function groupByYear(list: Hymn[]): HymnSection[] {
  const map = new Map<string, Hymn[]>();

  list.forEach((hymn) => {
    const bucket = map.get(hymn.year) ?? [];
    bucket.push(hymn);
    map.set(hymn.year, bucket);
  });

  return Array.from(map.entries())
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, hymnsOfYear]) => ({
      title: year === "JM" ? "" : year,
      data: [...hymnsOfYear].sort((a, b) => a.number - b.number),
    }));
}

function getAllYear(hymns: Hymn[]): string[] {
  return [...new Set(hymns.map((hymn) => hymn.year).filter(h => h !== "JM"))];
}

export default function HymnesScreen() {
  const { isDark } = useApp();
  const { isFavorite, favorites } = useDB();
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [maxHeight, setMaxHeight] = useState(150);

  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);
  const { bg, text, muted, } = useAppColors(isDark);
  const isSearching = !!search.trim();

  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites]
  );

  const flatResults = useMemo(() => {
    if (!isSearching) return [];
    return searchHymn(search.trim().toLowerCase());
  }, [search, isSearching]);

  const yearFilteredData = useMemo(() => {
    if (!selectedYear) return data;
    if (selectedYear === "all") return data;
    return data.filter((hymn) => hymn.year === selectedYear);
  }, [selectedYear]);

  const sections = useMemo(() => {
    if (isSearching) return [];
    return groupByYear(yearFilteredData);
  }, [isSearching, yearFilteredData]);

  const totalCount = isSearching ? flatResults.length : yearFilteredData.length;

  const renderItem = useCallback(
    ({ item }: { item: Hymn }) => {
      const isfav = favoriteIds.has(item.id);
      return (
        <HymnRow
          item={item}
          search={search}
          icon={isfav ? "heart" : undefined}
          iconColor={isfav ? "#cc0000" : ""}
        />
      );
    },
    [search, favoriteIds]
  );

  const keyExtractor = useCallback(
    (item: Hymn) => `${item.id}_${item.year}`,
    []
  );

  const handleScrollOffsetChange = useCallback((y: number) => {
    setShowScrollTop(y > 300);
  }, []);

  const scrollToTop = () => {
    if (isSearching) {
      listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    } else {
      listRef.current?.scrollToLocation?.({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
        viewOffset: 0,
      });
    }
  };

  const handleSelectYear = (year: string) => {
    setSelectedYear((current) => (current === year ? null : year));
    scrollToTop();
  };

  return (
    <AnimatedHeader
      insets={insets}
      maxHeight={maxHeight}
      minHeight={50}
      backgroundColor={bg}
      title="Fihirana Jesosy Mamonjy"
      rightButtonIcon="search"
      rightButtonPress={scrollToTop}
      onScrollOffsetChange={handleScrollOffsetChange}
      floatingButton={
        showScrollTop && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.scrollTopWrapper}
          >
            <TouchableOpacity
              style={styles.scrollTopButton}
              onPress={scrollToTop}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )
      }
      childrenHeader={
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: "#ffffff" }]}>Fihirana</Text>

              <Text style={[styles.subtitle, { color: "#ececec" }]}>
                {totalCount} chanson{totalCount > 1 && "s"}
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Ionicons name="musical-notes" size={23} color="#ffffff" />
            </View>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.search}>
              <SearchBar value={search} onChangeText={setSearch} dark={isDark} />
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={() => { setMaxHeight(showYear ? 150 : 220); setShowYear(!showYear) }}>
              <Ionicons name={showYear ? "close" : "filter-sharp"} size={28} color="#fff" />
              <Text style={[styles.filterText, { color: "#fff" }]}>{selectedYear === "all" ? "Tous" : selectedYear}</Text>
            </TouchableOpacity>
          </View>
          {showYear && <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.yearScroll}
            contentContainerStyle={styles.yearScrollContent}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleSelectYear("all")}
              style={[styles.year, selectedYear === "all" && styles.yearActive]}
            >
              <Text
                style={[
                  styles.yearText,
                  { color: selectedYear === "all" ? "#cc0000" : "#ffffff" },
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>
            {getAllYear(data).map((year) => {
              const active = selectedYear === year;

              return (
                <TouchableOpacity
                  key={year}
                  activeOpacity={0.75}
                  onPress={() => handleSelectYear(year)}
                  style={[styles.year, active && styles.yearActive]}
                >
                  <Text
                    style={[
                      styles.yearText,
                      { color: active ? "#cc0000" : "#ffffff" },
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>}
        </View>
      }
      renderScrollable={({ onScroll, scrollEventThrottle, contentContainerStyle }) => {
        const emptyComponent = (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={50} color="#9AA4AF" />

            <Text style={[styles.emptyTitle, { color: text }]}>
              Tsy misy hira
            </Text>

            <Text style={[styles.emptyText, { color: muted }]}>
              Tsy nahitana valiny.
            </Text>
          </View>
        );

        if (isSearching) {
          return (
            <Animated.FlatList
              ref={listRef}
              data={flatResults}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              removeClippedSubviews={true}
              initialNumToRender={12}
              maxToRenderPerBatch={12}
              updateCellsBatchingPeriod={50}
              windowSize={7}
              onScroll={onScroll}
              scrollEventThrottle={scrollEventThrottle}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                { padding: 10, paddingBottom: 100, marginTop: 20 },
                contentContainerStyle,
              ]}
              ListEmptyComponent={emptyComponent}
            />
          );
        }

        return (
          <AnimatedSectionList
            ref={listRef}
            sections={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
              section.title && <View style={[styles.sectionHeader, { backgroundColor: bg }]}>
                <Text style={[styles.sectionHeaderText, { color: "#cc0000" }]}>
                  {section.title}
                </Text>
              </View>
            )}
            removeClippedSubviews={true}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            updateCellsBatchingPeriod={50}
            windowSize={7}
            stickySectionHeadersEnabled
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { padding: 10, paddingBottom: 100, marginTop: 20 },
              contentContainerStyle,
            ]}
            ListEmptyComponent={emptyComponent}
          />
        );
      }}
    />
  );
}


const styles = StyleSheet.create({
  headerContainer: { flex: 1, flexDirection: "column", },
  header: { paddingTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { marginTop: 3, fontSize: 13 },
  headerIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#e6edf59f", alignItems: "center", justifyContent: "center", },
  searchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 20, },
  search: { paddingHorizontal: 0, flex: 1, },
  filterText: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  yearScroll: { marginTop: 14 },
  yearScrollContent: { flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 10 },
  year: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#ffffff26", },
  yearActive: { backgroundColor: "#ffffff", },
  yearText: { fontSize: 14, fontWeight: "700" },
  sectionHeader: { paddingHorizontal: 10, paddingVertical: 8 },
  sectionHeaderText: { fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 15 },
  emptyText: { marginTop: 5 },
  scrollTopWrapper: { position: "absolute", right: 20, bottom: 85, zIndex: 200, },
  scrollTopButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#cc0000", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6, },
});