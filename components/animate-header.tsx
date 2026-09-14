import { useApp } from "@/context/app-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useEffect } from "react";
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
  withTiming,
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
  const topMin = minHeight + insets.top;
  const { isDark } = useApp();

  const scrollY = useSharedValue(0);

  // maxHeight animé en douceur au lieu d'un saut instantané
  const animatedMaxHeight = useSharedValue(maxHeight + insets.top);

  useEffect(() => {
    animatedMaxHeight.value = withTiming(maxHeight + insets.top, {
      duration: 300,
    });
  }, [maxHeight]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;

    if (onScrollOffsetChange) {
      runOnJS(onScrollOffsetChange)(event.contentOffset.y);
    }
  });

  const headerStyle = useAnimatedStyle(() => {
    const topMaxAnim = animatedMaxHeight.value;
    const rangeAnim = topMaxAnim - topMin;

    return {
      height: interpolate(
        scrollY.value,
        [0, rangeAnim],
        [topMaxAnim, topMin],
        Extrapolation.CLAMP
      ),
    };
  });

  const headerStyleFixed = useAnimatedStyle(() => {
    const rangeAnim = animatedMaxHeight.value - topMin;

    return {
      height: interpolate(
        scrollY.value,
        [0, rangeAnim],
        [0, 80],
        Extrapolation.CLAMP
      ),
    };
  });

  const expandedStyle = useAnimatedStyle(() => {
    const rangeAnim = animatedMaxHeight.value - topMin;

    return {
      opacity: interpolate(
        scrollY.value,
        [0, rangeAnim * 0.6],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, rangeAnim],
            [0, -12],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const compactNumberStyle = useAnimatedStyle(() => {
    const rangeAnim = animatedMaxHeight.value - topMin;

    return {
      opacity: interpolate(
        scrollY.value,
        [0, rangeAnim * 0.3],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            scrollY.value,
            [0, rangeAnim * 0.3],
            [8, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const rangeAnim = animatedMaxHeight.value - topMin;

    return {
      opacity: interpolate(
        scrollY.value,
        [0, rangeAnim * 0.3],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <AnimatedLinearGradient
        colors={[barColor, isDark ? "#6e0000" : "#ff5f43"] as const}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
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
                style={[styles.barButton, { width: 35, height: 35, marginRight: 8, borderRadius: 10, },]}
                onPress={rightButtonPress}
              >
                <Ionicons name={rightButtonIcon} size={22} color="#fff" />
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
          paddingTop: maxHeight + insets.top,
          paddingBottom: 100 + insets.bottom,
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