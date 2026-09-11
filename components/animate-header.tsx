import { useApp } from "@/context/app-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";
import DraggableFloatingButton from "./draggable-floating-button";

const AnimatedLinearGradient =
  Animated.createAnimatedComponent(LinearGradient);

type ScrollProps = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: number;
  contentContainerStyle: { paddingTop: number; paddingBottom: number };
};

type Props = {
  renderScrollable: (scrollProps: ScrollProps) => ReactNode;
  childrenHeader?: ReactNode;
  floatingButton?: ReactNode;
  onScrollOffsetChange?: (y: number) => void;
  insets: EdgeInsets;
  maxHeight?: number;
  minHeight?: number;
  backgroundColor: string;
  barColor?: string;
  onBack?: () => void;
  rightButtonPress?: () => void;
  title: string;
  rightButtonIcon?: keyof typeof Ionicons.glyphMap;
  draggableButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    bg?: string;
  };
};

export default function AnimatedHeader({
  renderScrollable,
  childrenHeader,
  floatingButton,
  onScrollOffsetChange,
  insets,
  maxHeight = 220,
  minHeight = 72,
  backgroundColor,
  barColor = "#cc0000",
  onBack,
  rightButtonPress,
  title,
  rightButtonIcon,
  draggableButton,
}: Props) {
  const topMax = maxHeight + insets.top;
  const topMin = minHeight + insets.top;
  const range = topMax - topMin;
  const { isDark } = useApp();

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;

    if (onScrollOffsetChange) {
      runOnJS(onScrollOffsetChange)(event.contentOffset.y);
    }
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, range],
      [topMax, topMin],
      Extrapolation.CLAMP
    ),
  }));

  const headerStyleFixed = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, range],
      [0, 80],
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

  const compactNumberStyle = useAnimatedStyle(() => ({
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

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, range * 0.3],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <AnimatedLinearGradient
        colors={[barColor, isDark ? "#420000" : "#ff7171"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, headerStyle]}
      >
        <Animated.View style={[styles.bar, headerStyleFixed]}>
          {onBack && (
            <Animated.View style={[iconStyle]}>
              <TouchableOpacity style={styles.barButton} onPress={onBack}>
                <Ionicons name="chevron-back" size={31} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.barTextRow}>
            <Animated.Text
              style={[
                styles.barNumber,
                maxHeight !== minHeight
                  ? compactNumberStyle
                  : { opacity: 1, transform: [{ translateX: 0 }] },
              ]}
            >
              {title}
            </Animated.Text>
          </View>

          {rightButtonPress && rightButtonIcon && (
            <Animated.View style={[iconStyle]}>
              <TouchableOpacity
                style={[
                  styles.barButton,
                  {
                    width: 35,
                    height: 35,
                    marginRight: 8,
                    backgroundColor: "#ffffff69",
                    borderRadius: 10,
                  },
                ]}
                onPress={rightButtonPress}
              >
                <Ionicons name={rightButtonIcon} size={18} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {maxHeight !== minHeight && (
          <Animated.View
            style={[
              styles.expandedContent,
              { backgroundColor: "transparent" },
              expandedStyle,
            ]}
          >
            {childrenHeader}
          </Animated.View>
        )}
      </AnimatedLinearGradient>

      {renderScrollable({
        onScroll,
        scrollEventThrottle: 16,
        contentContainerStyle: {
          paddingTop: topMax,
          paddingBottom: 50 + insets.bottom,
        },
      })}

      {draggableButton && (
        <DraggableFloatingButton
          bg={draggableButton?.bg}
          icon={draggableButton?.icon}
          size={50}
          onPress={draggableButton?.onPress}
        />
      )}

      {floatingButton}
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
    alignItems: "flex-end",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 16,
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
  expandedContent: {
    flex: 1,
    marginHorizontal: 0,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});