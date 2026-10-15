import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { usePlayer } from "@/context/player-context";

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

export const MINI_PLAYER_HEIGHT = 125;

export function MiniPlayer({ bottom = 0, bg = "#fff", text = "#222" }: { bottom?: number; bg?: string; text?: string }) {
  const { current, status, toggle, seekTo, skip, stop } = usePlayer();
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  if (!current) return null;

  const duration = status.duration || 0;
  const position = dragging ? dragValue : status.currentTime || 0;
  const loading = !status.isLoaded || status.isBuffering;

  return (
    <View style={[styles.container, { bottom, backgroundColor: bg }]}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: text }]} numberOfLines={1}>
          {current.number}. {current.title}
        </Text>
        <TouchableOpacity onPress={stop} hitSlop={10}>
          <Ionicons name="close" size={22} color={text} />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration > 0 ? duration : 1}
        value={position}
        minimumTrackTintColor="#cc0000"
        maximumTrackTintColor="#cfcfcf"
        thumbTintColor="#cc0000"
        disabled={!status.isLoaded}
        onSlidingStart={() => setDragging(true)}
        onValueChange={setDragValue}
        onSlidingComplete={async (v) => {
          await seekTo(v);
          setDragging(false);
        }}
      />

      <View style={styles.bottom}>
        <Text style={[styles.time, { color: text }]}>{formatTime(position)}</Text>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => skip(-10)}>
            <Ionicons name="play-back" size={24} color={text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle} style={styles.playButton} activeOpacity={0.85}>
            {loading && !status.playing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name={status.playing ? "pause" : "play"} size={24} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => skip(10)}>
            <Ionicons name="play-forward" size={24} color={text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.time, { color: text }]}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 10,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 300,
    borderWidth: 1,
    borderColor: "#cc0000"
  },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { flex: 1, fontSize: 14, fontWeight: "700" },
  slider: { width: "100%", height: 32 },
  bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  time: { fontSize: 12, fontWeight: "600", width: 40 },
  controls: { flexDirection: "row", alignItems: "center", gap: 24 },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#cc0000",
    alignItems: "center",
    justifyContent: "center",
  },
});