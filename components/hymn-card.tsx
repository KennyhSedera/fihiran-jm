import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Hymn } from "../types/hymn";

interface Props {
  hymn: Hymn;
}

export default function HymnCard({ hymn }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/hymn/[id]",
          params: {
            id: hymn.id,
          },
        })
      }
    >
      <View style={styles.number}>
        <Text style={styles.numberText}>
          {hymn.number}
        </Text>
      </View>

      <View style={styles.info}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {hymn.title}
        </Text>

        <Text style={styles.category}>
          {hymn.category}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#A0A8B5"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EBF0",
  },

  number: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8F0F8",
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: "#1E3A5F",
    fontSize: 16,
    fontWeight: "800",
  },

  info: {
    flex: 1,
    marginHorizontal: 13,
  },

  title: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
  },

  category: {
    color: "#7E8999",
    fontSize: 12,
    marginTop: 5,
    textTransform: "capitalize",
  },
});