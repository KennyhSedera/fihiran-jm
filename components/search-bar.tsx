import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  dark?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  dark = false,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#ffffff1a", borderColor: "#ffffff", },
      ]}
    >
      <Ionicons name="search" size={21} color={"#fafafa"} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Mitadiava hira..."
        placeholderTextColor={"#d4d4d4"}
        style={[styles.input, { color: "#ffffff" },]}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <Ionicons name="close-circle" size={20} color="#e6e6e6" onPress={() => onChangeText("")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 42, borderRadius: 50, borderWidth: 1, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", },
  input: { flex: 1, marginHorizontal: 10, fontSize: 15, },
});