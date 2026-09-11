import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";

export function useCollapsibleHeaderScroll(expandedHeight: number) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  // La carte : rétrécit puis disparaît sur [0, expandedHeight]
  const expandedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [0, expandedHeight],
      [expandedHeight, 0],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollOffset.value,
      [0, expandedHeight * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );

    return { height, opacity };
  });

  // Le titre compact : apparaît juste quand la carte a fini de disparaître
  const compactTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [expandedHeight * 0.7, expandedHeight],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [expandedHeight * 0.7, expandedHeight],
      [8, 0],
      Extrapolation.CLAMP
    );

    return { opacity, transform: [{ translateY }] };
  });

  return {
    scrollRef,
    scrollOffset,
    expandedStyle,
    compactTitleStyle,
  };
}