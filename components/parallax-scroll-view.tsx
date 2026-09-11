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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const resolvedColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
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

  const { isDark } = useApp();
  const { bg } = useAppColors(isDark);

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
    <View style={styles.container}>
      <Animated.View style={[{ backgroundColor: bg, }, headerStyle]} />
      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor, flex: 1 }}
        scrollEventThrottle={16}>
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
  content: { flex: 1, padding: 12, gap: 16, overflow: 'hidden', },
});
