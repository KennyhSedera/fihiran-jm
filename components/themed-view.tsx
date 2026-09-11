import { View, type ViewProps } from 'react-native';

import { useApp } from '@/context/app-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { isDark } = useApp();

  return <View style={[{ backgroundColor: isDark ? "#101820" : "#F5F6F8" }, style]} {...otherProps} />;
}
