import { AudioStatus, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { deleteMusic, downloadMusic, getDownloadedMap } from "@/scripts/music-files";
import { Hymn } from "@/types/hymn";

type PlayerContextType = {
  current: Hymn | null;
  status: AudioStatus;
  playHymn: (hymn: Hymn) => void;
  toggle: () => void;
  seekTo: (seconds: number) => Promise<void>;
  skip: (delta: number) => void;
  stop: () => void;
  downloading: Set<string>;
  downloaded: Map<string, string>;
  isDownloaded: (id: string) => boolean;
  download: (hymn: Hymn) => Promise<void>;
  removeDownload: (id: string) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [current, setCurrent] = useState<Hymn | null>(null);
  const [downloaded, setDownloaded] = useState<Map<string, string>>(() => getDownloadedMap());
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  const toggle = useCallback(() => {
    if (status.playing) {
      player.pause();
      return;
    }
    // musique terminée : on repart du début
    if (status.duration > 0 && status.currentTime >= status.duration - 0.3) {
      player.seekTo(0);
    }
    player.play();
  }, [player, status.playing, status.currentTime, status.duration]);

  const playHymn = useCallback(
    (hymn: Hymn) => {
      const uri = downloaded.get(hymn.id) ?? hymn.music;
      if (!uri) return;
      if (current?.id === hymn.id) {
        toggle();
        return;
      }
      player.replace({ uri });
      player.play();
      setCurrent(hymn);
    },
    [current?.id, downloaded, player, toggle]
  );

  const seekTo = useCallback((s: number) => player.seekTo(s), [player]);

  const skip = useCallback(
    (delta: number) => {
      const target = Math.min(Math.max(status.currentTime + delta, 0), status.duration || 0);
      player.seekTo(target);
    },
    [player, status.currentTime, status.duration]
  );

  const stop = useCallback(() => {
    player.pause();
    setCurrent(null);
  }, [player]);

  const isDownloaded = useCallback((id: string) => downloaded.has(id), [downloaded]);

  const download = useCallback(async (hymn: Hymn) => {
    setDownloading((s) => new Set(s).add(hymn.id));
    try {
      const uri = await downloadMusic(hymn);
      setDownloaded((m) => new Map(m).set(hymn.id, uri));
    } finally {
      setDownloading((s) => {
        const n = new Set(s);
        n.delete(hymn.id);
        return n;
      });
    }
  }, []);

  const removeDownload = useCallback((id: string) => {
    deleteMusic(id);
    setDownloaded((m) => {
      const n = new Map(m);
      n.delete(id);
      return n;
    });
  }, []);

  const value = useMemo(
    () => ({
      current, status, playHymn, toggle, seekTo, skip, stop,
      downloading, downloaded, isDownloaded, download, removeDownload,
    }),
    [
      current, status, playHymn, toggle, seekTo, skip, stop,
      downloading, downloaded, isDownloaded, download, removeDownload,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer doit être utilisé dans PlayerProvider");
  return ctx;
}
