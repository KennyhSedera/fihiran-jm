import { useRef } from "react";
import { Animated } from "react-native";

type Options = {
  collapseDistance?: number; // distance de scroll (px) pour finir la transition
};

export function useCollapsingHeader({
  collapseDistance = 120,
}: Options = {}) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // on anime une "height", donc pas de native driver
  );

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [collapseDistance * 0.6, collapseDistance],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const cardOpacity = scrollY.interpolate({
    inputRange: [0, collapseDistance * 0.6],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const cardHeight = scrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [160, 0],
    extrapolate: "clamp",
  });

  const cardTranslateY = scrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [0, -16],
    extrapolate: "clamp",
  });

  return {
    scrollY,
    onScroll,
    compactTitleOpacity,
    cardOpacity,
    cardHeight,
    cardTranslateY,
  };
}