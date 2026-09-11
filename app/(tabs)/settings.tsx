import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import AnimatedHeader from "@/components/animate-header";
import {
  ThemeMode,
  useApp,
} from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { theme, setTheme, fontSize, handleChangeFontSize, isDark, fontFamily } = useApp();
  const insets = useSafeAreaInsets();
  const { bg, card, text, muted, } = useAppColors(isDark);

  const numbers = Array.from(
    { length: (30 - 14) / 2 + 1 },
    (_, i) => 14 + i * 2
  );

  const themes: {
    value: ThemeMode;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
      { value: "light", title: "Mazava", icon: "sunny-outline" },
      { value: "dark", title: "Maizina", icon: "moon-outline" },
      { value: "system", title: "Telephone", icon: "phone-portrait-outline" },
    ];

  return (
    <AnimatedHeader
      title="Paramètres"
      onBack={() => router.back()}
      backgroundColor={bg}
      insets={insets}
      maxHeight={100}
      minHeight={45}
      childrenHeader={
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: "#ffffff" }]}>Paramètres</Text>
              <Text style={[styles.subtitle, { color: "#ececec" }]}>
                Pesronnaliser votre application
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <FontAwesome name="cog" size={23} color="#ffffff" />
            </View>
          </View>
        </View>
      }
      renderScrollable={({ onScroll, scrollEventThrottle, contentContainerStyle }) => (
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={[styles.content, contentContainerStyle]}
        >
          <Text style={[styles.sectionTitle, { color: muted }]}>THÈME</Text>

          <View style={[styles.card, { backgroundColor: card }]}>
            {themes.map((item) => {
              const active = theme === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => setTheme(item.value)}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[styles.iconBox, active && styles.activeIconBox]}
                    >
                      <Ionicons name={item.icon} size={21} color={active ? "#FFFFFF" : "#cc0000"} />
                    </View>

                    <Text style={[styles.optionText, { color: text }]}>
                      {item.title}
                    </Text>
                  </View>

                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: muted, marginTop: 25 }]} >
            TEXTE
          </Text>

          <View style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.fontHeader}>
              <Text style={[styles.optionText, { color: text, fontFamily }]}>
                Taille du texte
              </Text>

              <Text style={[styles.fontValue, { color: muted }]}>
                {fontSize}
              </Text>
            </View>

            <View style={styles.fontControls}>
              {numbers.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.fontButton, { backgroundColor: item === fontSize ? "#cc0000" : "transparent", },]}
                  onPress={() => handleChangeFontSize(item)}
                >
                  <Text style={[styles.fontButtonText, { color: item === fontSize ? "#FFFFFF" : "#cc0000" },]} >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[{ color: muted, textAlign: "center", fontSize, fontFamily, marginBottom: 10, },]} >
              Fihirana Jesosy Mamonjy
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: muted, marginTop: 25 }]} >
            APPLICATION
          </Text>

          <View style={[styles.infoCard, { backgroundColor: card }]}>
            <Ionicons name="cloud-offline-outline" size={27} color="#cc0000" />

            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: text }]}>
                Fonctionnement offline
              </Text>

              <Text style={[styles.infoText, { color: muted }]}>
                Les chansons sont intégrées dans l'application. Aucun serveur
                n'est nécessaire pour lire les contenus.
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { flex: 1, flexDirection: "column" },
  header: { paddingTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { marginTop: 3, fontSize: 13 },
  headerIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#e6edf59f", alignItems: "center", justifyContent: "center", },
  content: { padding: 10, paddingBottom: 50, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1, marginBottom: 10 },
  card: { borderRadius: 18, overflow: "hidden" },
  option: { minHeight: 67, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#E5EBF1", alignItems: "center", justifyContent: "center" },
  activeIconBox: { backgroundColor: "#cc0000" },
  optionText: { fontSize: 16, fontWeight: "600" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#A4ADB7", alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: "#cc0000" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#cc0000" },
  fontHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fontValue: { fontSize: 16, fontWeight: "700" },
  fontControls: { padding: 15, paddingTop: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  fontButton: { padding: 8, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  fontButtonText: { fontSize: 14, fontWeight: "800" },
  preview: { flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  previewText: { fontWeight: "500" },
  infoCard: { padding: 18, borderRadius: 18, flexDirection: "row", gap: 14 },
  infoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 5 },
  infoText: { fontSize: 13, lineHeight: 20 },
  version: { textAlign: "center", marginTop: 35, lineHeight: 20 },
});