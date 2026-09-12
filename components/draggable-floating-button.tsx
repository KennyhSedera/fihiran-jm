import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const EDGE_MARGIN = 15;
const VERTICAL_MARGIN = 20;
const STORAGE_KEY_PREFIX = "@draggable_button_position:";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
  bg?: string;
  storageKey?: string;
}

export default function DraggableFloatingButton({
  icon = "settings",
  size = 70,
  onPress,
  bg = "#ff0000",
  storageKey = "default",
}: Props) {
  const initialX = SCREEN_WIDTH - size - EDGE_MARGIN;
  const initialY = SCREEN_HEIGHT / 2 - size / 2;

  const storageFullKey = `${STORAGE_KEY_PREFIX}${storageKey}`;

  const position = useRef(
    new Animated.ValueXY({
      x: initialX,
      y: initialY,
    })
  ).current;

  const currentPosition = useRef({
    x: initialX,
    y: initialY,
  });

  const startPosition = useRef({
    x: initialX,
    y: initialY,
  });

  // Charge la position sauvegardée au montage
  useEffect(() => {
    let cancelled = false;

    async function loadPosition() {
      try {
        const saved = await AsyncStorage.getItem(storageFullKey);

        if (!saved || cancelled) return;

        const parsed = JSON.parse(saved) as { x: number; y: number };

        // Re-clamp au cas où la taille d'écran aurait changé (rotation, autre device)
        const x = Math.max(
          EDGE_MARGIN,
          Math.min(SCREEN_WIDTH - size - EDGE_MARGIN, parsed.x)
        );
        const y = Math.max(
          VERTICAL_MARGIN,
          Math.min(SCREEN_HEIGHT - size - VERTICAL_MARGIN, parsed.y)
        );

        currentPosition.current = { x, y };
        startPosition.current = { x, y };
        position.setValue({ x, y });
      } catch {
        // ignore silencieusement, on garde la position par défaut
      }
    }

    loadPosition();

    return () => {
      cancelled = true;
    };
  }, [storageFullKey, size]);

  const savePosition = (x: number, y: number) => {
    AsyncStorage.setItem(storageFullKey, JSON.stringify({ x, y })).catch(
      () => {
        // ignore silencieusement
      }
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2
        );
      },

      onPanResponderGrant: () => {
        startPosition.current = {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        };
      },

      onPanResponderMove: (_, gestureState) => {
        let x = startPosition.current.x + gestureState.dx;
        let y = startPosition.current.y + gestureState.dy;

        x = Math.max(
          EDGE_MARGIN,
          Math.min(SCREEN_WIDTH - size - EDGE_MARGIN, x)
        );

        y = Math.max(
          VERTICAL_MARGIN,
          Math.min(SCREEN_HEIGHT - size - VERTICAL_MARGIN, y)
        );

        position.setValue({ x, y });
      },

      onPanResponderRelease: (_, gestureState) => {
        let x = startPosition.current.x + gestureState.dx;
        let y = startPosition.current.y + gestureState.dy;

        y = Math.max(
          VERTICAL_MARGIN,
          Math.min(SCREEN_HEIGHT - size - VERTICAL_MARGIN, y)
        );

        const centerX = SCREEN_WIDTH / 2;

        if (x + size / 2 < centerX) {
          x = EDGE_MARGIN;
        } else {
          x = SCREEN_WIDTH - size - EDGE_MARGIN;
        }

        currentPosition.current = { x, y };

        Animated.spring(position, {
          toValue: { x, y },
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }).start();

        savePosition(x, y);
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: position.getTranslateTransform(),
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bg,
          },
        ]}
      >
        <Ionicons name={icon} size={size / 2} color="#D8DCE2" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 99999,
    elevation: 999,
    overflow: "visible",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0864C7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 15,
  },
});