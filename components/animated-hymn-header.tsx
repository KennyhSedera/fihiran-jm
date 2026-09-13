import { useApp } from "@/context/app-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";
import DraggableFloatingButton from "./draggable-floating-button";

type Props = {
  children: ReactNode;
  insets: EdgeInsets;
  maxHeight?: number;
  minHeight?: number;
  backgroundColor: string;
  barColor?: string;
  onBack: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  title: string;
  number: number | string;
  category: string;
  keySig?: string;
  cardBackgroundColor: string;
  textColor: string;
  mutedColor?: string;
  fontFamily?: string;
  draggableButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    bg?: string;
  }
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AnimatedHymnHeader({
  children,
  insets,
  maxHeight = 220,
  minHeight = 72,
  backgroundColor,
  barColor = "#cc0000",
  onBack,
  onToggleFavorite,
  isFavorite,
  title,
  number,
  category,
  fontFamily,
  draggableButton,
}: Props) {
  const topMax = maxHeight + insets.top;
  const topMin = minHeight + insets.top;
  const range = topMax - topMin;
  const { isDark } = useApp();

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, range],
      [topMax, topMin],
      Extrapolation.CLAMP
    ),
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, range * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, range],
          [0, -12],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, range * 0.3],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateX: interpolate(
          scrollY.value,
          [0, range * 0.3],
          [8, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={{ flex: 1 }}>
      <AnimatedLinearGradient
        colors={[barColor, isDark ? "#6e0000" : "#ff5f43"] as const}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.header, headerStyle]}
      >
        <View style={[styles.bar, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.barButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={31} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.barTextRow}>
            <Animated.Text
              numberOfLines={1}
              style={[styles.barTitle, compactTitleStyle]}
            >
              {number}.  {title}
            </Animated.Text>
          </View>

          <TouchableOpacity
            style={styles.barButton}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.expandedContent,
            { backgroundColor: "transparent" },
            expandedStyle,
          ]}
        >
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>{number}</Text>
          </View>

          <View style={styles.info}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: "#fff", fontFamily }]}
            >
              {title}
            </Text>
            <Text style={[styles.category, { fontFamily }]}>
              {category}
            </Text>
          </View>
        </Animated.View>
      </AnimatedLinearGradient>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ backgroundColor, flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topMax,
          paddingBottom: 50 + insets.bottom,
        }}
      >
        {children}
      </Animated.ScrollView>

      {draggableButton && <DraggableFloatingButton
        bg={draggableButton?.bg}
        icon={draggableButton?.icon}
        size={50}
        onPress={draggableButton?.onPress}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 100,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  bar: {
    height: 72,
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
  barTextRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 8,
  },
  barNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  barTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  expandedContent: {
    flex: 1,
    borderRadius: 20,
    gap: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  numberBox: {
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "#cc0000",
    fontSize: 28,
    fontWeight: "500",
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 18,
  },
  title: {
    fontSize: 23,
    lineHeight: 27,
    fontWeight: "700",
  },
  category: {
    color: "#ffe7e7",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    textTransform: "capitalize",
    marginTop: 5,
  },
  keySig: {
    fontSize: 13,
    marginTop: 4,
  },
});