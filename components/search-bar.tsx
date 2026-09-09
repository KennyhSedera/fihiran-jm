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
        {
          backgroundColor: dark
            ? "#17212B"
            : "#FFFFFF",
          borderColor: dark
            ? "#26323D"
            : "#E3E7EC",
        },
      ]}
    >
      <Ionicons
        name="search"
        size={21}
        color={dark ? "#A5B0BB" : "#7C8795"}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Mitadiava hira..."
        placeholderTextColor={
          dark ? "#71808D" : "#9BA4AF"
        }
        style={[
          styles.input,
          {
            color: dark
              ? "#FFFFFF"
              : "#172033",
          },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color="#8A95A2"
          onPress={() => onChangeText("")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
  },
});