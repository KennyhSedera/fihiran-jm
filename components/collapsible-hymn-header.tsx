import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

type Props = {
  insets: EdgeInsets;
  title: string;
  number: number | string;
  category: string;
  keySig?: string;
  isDark: boolean;
  isFavorite: boolean;
  fontFamily?: string;
  compactTitleOpacity: Animated.AnimatedInterpolation<number>;
  cardOpacity: Animated.AnimatedInterpolation<number>;
  cardHeight: Animated.AnimatedInterpolation<number>;
  cardTranslateY: Animated.AnimatedInterpolation<number>;
  onBack: () => void;
  onToggleFavorite: () => void;
};

export function CollapsibleHymnHeader({
  insets,
  title,
  number,
  category,
  keySig,
  isDark,
  isFavorite,
  fontFamily,
  compactTitleOpacity,
  cardOpacity,
  cardHeight,
  cardTranslateY,
  onBack,
  onToggleFavorite,
}: Props) {
  const card = isDark ? "#17212B" : "#FFFFFF";
  const text = isDark ? "#F5F7FA" : "#172033";
  const muted = isDark ? "#A1ADB8" : "#737D8A";

  return (
    <>
      {/* BARRE COMPACTE — toujours visible en haut */}
      <View
        style={[
          styles.bar,
          { paddingTop: insets.top },
        ]}
      >
        <TouchableOpacity
          style={styles.barButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={31} color="#FFFFFF" />
        </TouchableOpacity>

        <Animated.Text
          numberOfLines={1}
          style={[
            styles.barTitle,
            { opacity: compactTitleOpacity },
          ]}
        >
          {number} - {title}
        </Animated.Text>

        <TouchableOpacity
          style={styles.barButton}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={27}
            color={isFavorite ? "#FF7080" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* CARTE INFO — se réduit et disparaît au scroll */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: card,
            opacity: cardOpacity,
            height: cardHeight,
            transform: [{ translateY: cardTranslateY }],
          },
        ]}
      >
        <View style={styles.numberBox}>
          <Animated.Text style={styles.numberText}>{number}</Animated.Text>
        </View>

        <View style={styles.info}>
          <Animated.Text
            style={[styles.title, { color: text, fontFamily }]}
            numberOfLines={2}
          >
            {title}
          </Animated.Text>

          <Animated.Text style={styles.category}>{category}</Animated.Text>

          {!!keySig && (
            <Animated.Text style={[styles.keySig, { color: muted }]}>
              {keySig}
            </Animated.Text>
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 72,
    backgroundColor: "#173253",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  barButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  barTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  card: {
    overflow: "hidden",
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
  },
  numberBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#173253",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "500",
  },
  info: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },
  category: {
    color: "#173253",
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    marginTop: 6,
  },
  keySig: {
    fontSize: 14,
    marginTop: 5,
  },
});