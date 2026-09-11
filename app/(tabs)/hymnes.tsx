import { Ionicons } from "@expo/vector-icons";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
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

export default function HymnesScreen() {
  const { isDark, isFavorite } = useApp();
  const [search, setSearch] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);
  const { bg, text, muted, } = useAppColors(isDark);
  const isSearching = !!search.trim();

  const flatResults = useMemo(() => {
    if (!isSearching) return [];
    return searchHymn(search.trim().toLowerCase());
  }, [search, isSearching]);

  const sections = useMemo(() => {
    if (isSearching) return [];
    return groupByYear(data);
  }, [isSearching]);

  const totalCount = isSearching ? flatResults.length : data.length;

  const renderItem = ({ item }: { item: Hymn }) => {
    const isfav = isFavorite(item.id);
    return (
      <HymnRow
        item={item}
        search={search}
        icon={isfav ? "heart" : undefined}
        iconColor={isfav ? "#cc0000" : ""}
      />
    )
  };

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

  return (
    <AnimatedHeader
      insets={insets}
      maxHeight={150}
      minHeight={50}
      backgroundColor={bg}
      barColor="#cc0000"
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

          <View style={styles.search}>
            <SearchBar value={search} onChangeText={setSearch} dark={isDark} />
          </View>
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
  search: { paddingHorizontal: 0, paddingTop: 15, },
  sectionHeader: { paddingHorizontal: 10, paddingVertical: 8 },
  sectionHeaderText: { fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 15 },
  emptyText: { marginTop: 5 },
  scrollTopWrapper: { position: "absolute", right: 20, bottom: 85, zIndex: 200, },
  scrollTopButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#cc0000", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6, },
});