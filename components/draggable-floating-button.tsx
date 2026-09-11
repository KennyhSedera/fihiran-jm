import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

/**
 * Marge entre le bouton et les bords gauche/droit.
 */
const EDGE_MARGIN = 15;

/**
 * Marge verticale.
 *
 * Mets 0 si tu veux pouvoir aller complètement
 * en haut et en bas.
 */
const VERTICAL_MARGIN = 20;

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
  bg?: string;
}

export default function DraggableFloatingButton({
  icon = "settings",
  size = 70,
  onPress,
  bg = "#ff0000",
}: Props) {
  const initialX = SCREEN_WIDTH - size - EDGE_MARGIN;
  const initialY = SCREEN_HEIGHT / 2 - size / 2;

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

  const panResponder = useRef(
    PanResponder.create({

      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 2 ||
          Math.abs(gestureState.dy) > 2
        );
      },

      onPanResponderGrant: () => {
        startPosition.current = {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        };
      },

      onPanResponderMove: (_, gestureState) => {
        let x =
          startPosition.current.x +
          gestureState.dx;

        let y =
          startPosition.current.y +
          gestureState.dy;

        x = Math.max(
          EDGE_MARGIN,
          Math.min(
            SCREEN_WIDTH - size - EDGE_MARGIN,
            x
          )
        );

        y = Math.max(
          VERTICAL_MARGIN,
          Math.min(
            SCREEN_HEIGHT - size - VERTICAL_MARGIN,
            y
          )
        );

        position.setValue({
          x,
          y,
        });
      },

      onPanResponderRelease: (_, gestureState) => {
        let x =
          startPosition.current.x +
          gestureState.dx;

        let y =
          startPosition.current.y +
          gestureState.dy;

        y = Math.max(
          VERTICAL_MARGIN,
          Math.min(
            SCREEN_HEIGHT - size - VERTICAL_MARGIN,
            y
          )
        );

        const centerX = SCREEN_WIDTH / 2;

        if (x + size / 2 < centerX) {
          x = EDGE_MARGIN;
        } else {
          x =
            SCREEN_WIDTH -
            size -
            EDGE_MARGIN;
        }

        currentPosition.current = {
          x,
          y,
        };

        Animated.spring(position, {
          toValue: {
            x,
            y,
          },
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }).start();
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

          transform:
            position.getTranslateTransform(),
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
        <Ionicons
          name={icon}
          size={size / 2}
          color="#D8DCE2"
        />
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