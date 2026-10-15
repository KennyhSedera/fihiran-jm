import { useApp } from "@/context/app-context";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ModalAction = {
  label: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void | Promise<void>;
  destructive?: boolean;
  loading?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions: ModalAction[];
  cancelLabel?: string;
  bg?: string;
  text?: string;
  muted?: string;
};

export function ActionModal({
  visible,
  onClose,
  title,
  subtitle,
  actions,
  cancelLabel = "Akatona",
  bg = "#fff",
  text = "#222",
  muted = "#777",
}: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useApp();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* fond sombre : un appui ferme le modal */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: bg, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />

        <Text style={[styles.title, { color: text }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={[styles.subtitle, { color: muted }]}>{subtitle}</Text> : null}

        <View style={styles.actions}>
          {actions.map((action) => {
            const color = action.destructive ? "#cc0000" : text;
            return (
              <TouchableOpacity
                key={action.label}
                style={styles.action}
                activeOpacity={0.7}
                disabled={action.loading}
                onPress={async () => {
                  onClose();
                  await action.onPress();
                }}
              >
                {action.loading ? (
                  <ActivityIndicator color="#cc0000" />
                ) : (
                  action.icon && <Ionicons name={action.icon} size={22} color={color} />
                )}
                <Text style={[styles.actionText, { color }]}>{action.label}</Text>x
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.cancel, { backgroundColor: isDark ? "#141414de" : "#f3f3f3" }]} activeOpacity={0.7} onPress={onClose}>
          <Text style={[styles.cancelText, { color: muted }]}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#bbb",
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 13, textAlign: "center", marginTop: 4 },
  actions: { marginTop: 16, gap: 6 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  actionText: { fontSize: 16, fontWeight: "600" },
  cancel: { alignItems: "center", paddingVertical: 14, marginTop: 6, borderRadius: 10 },
  cancelText: { fontSize: 15, fontWeight: "700" },
});