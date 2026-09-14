import { useApp } from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import DraggableFloatingButton from "./draggable-floating-button";

interface Props {
  headerContent: ReactNode;
  children: ReactNode;
  height?: number;
  draggableButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    bg?: string;
  }
}

export default function AppHeader({
  headerContent,
  children,
  draggableButton,
  height = 120
}: Props) {
  const { isDark } = useApp();
  const { bg } = useAppColors(isDark);

  return (
    <View style={[styles.container, { backgroundColor: bg }]} >
      <LinearGradient
        colors={["#cc0000", isDark ? "#6e0000" : "#ff5f43"] as const}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.header, { height },]}>
        {headerContent}
      </LinearGradient>

      <View style={[styles.content,]}>
        {children}
      </View>

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
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 25,
    marginBottom: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  content: {
    flex: 1,
  },
});