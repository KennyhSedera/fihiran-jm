import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ThemeMode,
  useApp,
} from "@/context/app-context";

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    isDark,
    fontFamily,
  } = useApp();

  const bg = isDark ? "#101820" : "#F5F6F8";
  const card = isDark ? "#17212B" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#172033";
  const muted = isDark ? "#9BA8B4" : "#7D8795";

  const themes: {
    value: ThemeMode;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
      {
        value: "light",
        title: "Mazava",
        icon: "sunny-outline",
      },
      {
        value: "dark",
        title: "Maizina",
        icon: "moon-outline",
      },
      {
        value: "system",
        title: "Telephone",
        icon: "phone-portrait-outline",
      },
    ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bg },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text
          style={[
            styles.title,
            { color: text },
          ]}
        >
          Paramètres
        </Text>

        {/* THEME */}

        <Text
          style={[
            styles.sectionTitle,
            { color: muted },
          ]}
        >
          THÈME
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: card },
          ]}
        >
          {themes.map((item) => {
            const active =
              theme === item.value;

            return (
              <TouchableOpacity
                key={item.value}
                style={styles.option}
                onPress={() =>
                  setTheme(item.value)
                }
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      active &&
                      styles.activeIconBox,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={21}
                      color={
                        active
                          ? "#FFFFFF"
                          : "#173253"
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      { color: text },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    active &&
                    styles.radioActive,
                  ]}
                >
                  {active && (
                    <View
                      style={styles.radioDot}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FONT */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: muted,
              marginTop: 25,
            },
          ]}
        >
          TEXTE
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: card },
          ]}
        >
          <View style={styles.fontHeader}>
            <Text
              style={[
                styles.optionText,
                {
                  color: text,
                  fontFamily,
                },
              ]}
            >
              Taille du texte
            </Text>

            <Text
              style={[
                styles.fontValue,
                { color: muted },
              ]}
            >
              {fontSize}
            </Text>
          </View>

          <View style={styles.fontControls}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={decreaseFontSize}
            >
              <Text style={styles.fontButtonText}>
                A-
              </Text>
            </TouchableOpacity>

            <View style={styles.preview}>
              <Text
                style={[
                  styles.previewText,
                  {
                    color: text,
                    fontFamily,
                    fontSize,
                  },
                ]}
                numberOfLines={1}
              >
                Fihirana Jesosy Mamonjy
              </Text>
            </View>

            <TouchableOpacity
              style={styles.fontButton}
              onPress={increaseFontSize}
            >
              <Text style={styles.fontButtonText}>
                A+
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OFFLINE */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: muted,
              marginTop: 25,
            },
          ]}
        >
          APPLICATION
        </Text>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: card },
          ]}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={27}
            color="#173253"
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.infoTitle,
                { color: text },
              ]}
            >
              Fonctionnement offline
            </Text>

            <Text
              style={[
                styles.infoText,
                { color: muted },
              ]}
            >
              Les chansons sont intégrées dans
              l'application. Aucun serveur n'est
              nécessaire pour lire les contenus.
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.version,
            { color: muted },
          ]}
        >
          Fihirana Jesosy Mamonjy
          {"\n"}
          JM
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  card: {
    borderRadius: 18,
    overflow: "hidden",
  },

  option: {
    minHeight: 67,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#E5EBF1",
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconBox: {
    backgroundColor: "#173253",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A4ADB7",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    borderColor: "#173253",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#173253",
  },

  fontHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fontValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  fontControls: {
    padding: 15,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  fontButton: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#E5EBF1",
    justifyContent: "center",
    alignItems: "center",
  },

  fontButtonText: {
    color: "#173253",
    fontSize: 19,
    fontWeight: "800",
  },

  preview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  previewText: {
    fontWeight: "500",
  },

  infoCard: {
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    gap: 14,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },

  version: {
    textAlign: "center",
    marginTop: 35,
    lineHeight: 20,
  },
});