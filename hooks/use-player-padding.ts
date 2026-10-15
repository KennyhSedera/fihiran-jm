import { MINI_PLAYER_HEIGHT } from "@/components/mini-player";
import { usePlayer } from "@/context/player-context";

export function usePlayerPadding() {
  const { current } = usePlayer();
  return current ? MINI_PLAYER_HEIGHT + 10 : 0;
}