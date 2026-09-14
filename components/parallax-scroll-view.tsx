import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { useApp } from '@/context/app-context';
import { useAppColors } from '@/hooks/use-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
}: Props) {
  const { isDark } = useApp();
  const { bg } = useAppColors(isDark);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT],
        [0, 28],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Animated.View style={[{ backgroundColor: bg, }, headerStyle]} />
      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor: bg, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: bg },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <View style={[styles.content, { backgroundColor: bg }]}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  header: { height: HEADER_HEIGHT, overflow: 'hidden', },
  content: { padding: 12, gap: 16, overflow: 'hidden', },
});