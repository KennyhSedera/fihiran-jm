import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import hymnes from "@/assets/json/fihirana_jm.json";
import SearchBar from "@/components/search-bar";
import { useApp } from "@/context/app-context";
import { Hymn } from "@/types/hymn";

const data = hymnes as Hymn[];

type HymnRowProps = {
  item: Hymn;
  card: string;
  text: string;
  muted: string;
  fontFamily: string;
};

const HymnRow = React.memo(function HymnRow({
  item,
  card,
  text,
  muted,
  fontFamily,
}: HymnRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
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
          numberOfLines={2}
          style={[
            styles.hymnTitle,
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
            styles.category,
            { color: muted },
          ]}
        >
          {item.category}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={muted}
      />
    </TouchableOpacity>
  );
});

export default function HymnesScreen() {
  const { isDark, fontFamily } = useApp();

  const [search, setSearch] =
    useState("");

  const bg = isDark ? "#101820" : "#F5F6F8";
  const card = isDark ? "#17212B" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#172033";
  const muted = isDark ? "#9BA8B4" : "#7D8795";

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const sorted = [...data].sort(
      (a, b) => a.number - b.number
    );

    if (!query) return sorted;

    return sorted.filter((hymn) => {
      return (
        String(hymn.number).includes(query) ||
        hymn.title
          .toLowerCase()
          .includes(query) ||
        hymn.category
          .toLowerCase()
          .includes(query)
      );
    });
  }, [search]);

  const renderItem = useCallback(
    ({ item }: { item: Hymn }) => (
      <HymnRow
        item={item}
        card={card}
        text={text}
        muted={muted}
        fontFamily={fontFamily ?? ""}
      />
    ),
    [card, text, muted, fontFamily]
  );

  const keyExtractor = useCallback(
    (item: Hymn) => `${item.id}_${item.year}`,
    []
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              { color: text },
            ]}
          >
            Fihirana
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: muted },
            ]}
          >
            {filtered.length} hira
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="musical-notes"
            size={23}
            color="#173253"
          />
        </View>
      </View>

      <View style={styles.search}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          dark={isDark}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 5,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={50}
              color="#9AA4AF"
            />

            <Text
              style={[
                styles.emptyTitle,
                { color: text },
              ]}
            >
              Tsy misy hira
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: muted },
              ]}
            >
              Tsy nahitana valiny.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E6EDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  search: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },

  card: {
    minHeight: 70,
    padding: 12,
    borderRadius: 17,
    marginBottom: 9,
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
    fontSize: 15,
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
    marginTop: 4,
    fontSize: 12,
    textTransform: "capitalize",
  },

  empty: {
    alignItems: "center",
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    marginTop: 5,
  },
});