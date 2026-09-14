import { Entypo, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated from "react-native-reanimated";

import AnimatedHeader from "@/components/animate-header";
import {
  FONT_FAMILY_MAP,
  FONT_LABELS,
  FontChoice,
  ThemeMode,
  useApp,
} from "@/context/app-context";
import { useAppColors } from "@/hooks/use-color";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { theme, setTheme, fontSize, handleChangeFontSize, isDark, fontFamily, setFontChoice } = useApp();
  const insets = useSafeAreaInsets();
  const { bg, card, text, muted, } = useAppColors(isDark);

  const fontOptions: FontChoice[] = ["patrickHand", "caveat", "kalam", "comicNeue"];

  const contacts = [
    {
      icon: "logo-whatsapp",
      title: "Tel",
      value: "+261 34 92 870 65",
      color: "green",
      onPress: () => Linking.openURL("https://wa.me/261349287065"),
    },
    {
      icon: "logo-facebook",
      title: "Facebook",
      value: "Kennyh Sedera",
      color: "#3374ff",
      onPress: () => Linking.openURL("https://facebook.com/profile.php?id=100006716355270"),
    },
    {
      icon: "mail-outline",
      title: "Email",
      color: "",
      value: "kennyhsedera@gmail.com",
      onPress: () => Linking.openURL("mailto:kennyhsedera@gmail.com"),
    },
  ];

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
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.sectionTitleContainer, { marginTop: 0 }]}>
            <Ionicons name="color-palette" size={20} color={"#cc0000"} />
            <Text style={[styles.sectionTitle, { color: muted }]}>THÈME</Text>
          </View>

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

          <View style={[styles.sectionTitleContainer]} >
            <Ionicons name="text-sharp" size={20} color={"#cc0000"} />
            <Text style={[styles.sectionTitle, { color: muted }]}>TEXTE</Text>
          </View>

          <View style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.fontHeader}>
              <Text style={[styles.optionText, { color: text, fontFamily }]}>
                Taille du texte
              </Text>

              <Text style={[styles.fontValue, { color: muted, fontFamily }]}>
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

          <View style={[styles.card, { backgroundColor: card, marginTop: 10 }]}>
            <View style={styles.fontHeader}>
              <Text style={[styles.optionText, { color: text, fontFamily }]}>
                Police du texte
              </Text>
            </View>
            <View style={[styles.fontControls, { justifyContent: "space-between", }]}>
              {
                fontOptions.map((choice) => {
                  const active = FONT_FAMILY_MAP[choice] === fontFamily;
                  return (
                    <TouchableOpacity
                      key={choice}
                      style={[styles.optionFontFamily, { backgroundColor: active ? "#cc0000" : isDark ? "#f5f6f81a" : "#00000011", },]}
                      onPress={() => setFontChoice(choice)}
                    >
                      <Text style={{ color: active ? "#FFFFFF" : text, fontFamily: FONT_FAMILY_MAP[choice], }}>
                        {FONT_LABELS[choice]}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }

            </View>
          </View>

          <View style={[styles.sectionTitleContainer]} >
            <Ionicons name="cog-sharp" size={20} color={"#cc0000"} />
            <Text style={[styles.sectionTitle, { color: muted }]}>APPLICATION</Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: card, }]}>
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

          <View style={[styles.infoCard, { backgroundColor: card, marginTop: 10, }]}>
            <Entypo name="note" size={27} color="#b30000" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: text }]}>
                Notes musicales
              </Text>

              <Text style={[styles.infoText, { color: muted }]}>
                Vous pouvez enregistrer vos notes musicales sur votre appareil.
                Fonctionnalités en cours de developpement
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: card, marginTop: 10, }]}>
            <FontAwesome5 name="headphones" size={27} color="#b30000" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: text }]}>
                Chants & Musiques
              </Text>

              <Text style={[styles.infoText, { color: muted }]}>
                Les musiques sont telecharger et stockees sur votre appareil.
                Fonctionnalités en cours de developpement
              </Text>
            </View>
          </View>

          <View style={[styles.sectionTitleContainer]}>
            <Ionicons name="call" size={20} color={"#cc0000"} />
            <Text style={[styles.sectionTitle, { color: muted }]}>CONTACT</Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: card, justifyContent: "space-between", }]}>
            {contacts.map((contact, index) => (
              <Pressable
                key={index}
                style={styles.contact}
                onPress={contact.onPress}
              >
                <Ionicons name={contact.icon as any} size={27} color={contact.color || "#cc0000"} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: text }]}>
                    {contact.title}
                  </Text>
                </View>
                <Text numberOfLines={1} style={[styles.infoText, { color: muted }]}>
                  {contact.value}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionTitleContainer]}>
            <Ionicons name="information-circle" size={20} color={"#cc0000"} />
            <Text style={[styles.sectionTitle, { color: muted }]}>A PROPOS</Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: card, flexDirection: "column", gap: 10, alignItems: "center", }]}>
            <Image source={require("@/assets/images/fihirana2.png")} style={styles.infoImage} />
            <Text style={[styles.infoLabel, { color: muted }]}>Version <Text style={[{ color: text }]}>1.0.0</Text></Text>
            <Text style={[styles.infoApp, { color: text }]}>  Fihirana Jesosy Mamonjy </Text>
            <Text style={[styles.infoAuthor, { color: muted }]}> Créé par Kennyh Sedera </Text>
            <Text style={[styles.infoCopyright, { color: muted }]}> © 2026 </Text>
            <Text style={[styles.infoSlogan, { color: "#cc0000" }]}>
              "Vonnahitra ho an'Andriamanitra irery ihany"
            </Text>
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
  sectionTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  sectionTitleContainer: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10, marginTop: 35, },
  card: { borderRadius: 18, overflow: "hidden" },
  option: { minHeight: 67, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#E5EBF1", alignItems: "center", justifyContent: "center" },
  activeIconBox: { backgroundColor: "#cc0000" },
  optionText: { fontSize: 16, fontWeight: "600" },
  optionFontFamily: { height: 30, paddingHorizontal: 15, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#A4ADB7", alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: "#cc0000" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#cc0000" },
  fontHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fontValue: { fontSize: 16, },
  fontControls: { padding: 15, paddingTop: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  fontButton: { padding: 8, paddingHorizontal: 9, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  fontButtonText: { fontSize: 14, fontWeight: "800" },
  preview: { flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  previewText: { fontWeight: "500" },
  infoCard: { padding: 18, borderRadius: 18, flexDirection: "row", gap: 14 },
  infoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 5 },
  infoText: { fontSize: 13, lineHeight: 20 },
  version: { textAlign: "center", marginTop: 35, lineHeight: 20 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", },
  infoLabel: { fontSize: 15, fontWeight: "600", },
  infoImage: { width: 52, height: 52, borderRadius: 15, objectFit: "cover" },
  infoApp: { fontSize: 15, fontWeight: "700", textAlign: "center", marginTop: 10, textTransform: "uppercase" },
  infoAuthor: { fontSize: 13, textAlign: "center", },
  infoCopyright: { fontSize: 12, textAlign: "center", },
  infoSlogan: { fontSize: 13, textAlign: "center", marginTop: 4, fontStyle: "italic", },
  contact: { alignItems: "center", justifyContent: "center", width: "30%" },
});