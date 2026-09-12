import { Controller, initDB } from "@/api/db.sqlite";
import hymnes from "@/assets/json/fihirana_jm.json";
import { DBContextType, Favorite, LastReads } from "@/types/db.type";
import { Hymn } from "@/types/hymn";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const DBContext = createContext<DBContextType | null>(null);

const data = hymnes as Hymn[];

export function DBProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [favorites, setFavorites] = useState<Hymn[]>([]);
  const [lastReads, setLastReads] = useState<Hymn[]>([]);

  const controller = Controller(db);

  function getHymnsInFavorites(fav: Favorite[]): Hymn[] {
    return data
      .filter((item) => fav.some((fav) => fav.hymn_id === item.id))
      .sort((a, b) => a.number - b.number);
  }

  function getHymnsInLastReads(last: LastReads[]): Hymn[] {
    const hymnsMap = new Map(data.map((hymn) => [String(hymn.id), hymn]));

    return last
      .map((lastRead) => hymnsMap.get(String(lastRead.hymn_id)))
      .filter((hymn): hymn is Hymn => hymn !== undefined);
  }

  async function getFavorites() {
    try {
      const res = (await controller.getFavorites()) as Favorite[];
      setFavorites(getHymnsInFavorites(res));
    } catch (error) {
      console.error("Erreur dans getFavorites", error);
    }
  }

  async function getLastReads() {
    try {
      const res = (await controller.getLastReads()) as LastReads[];
      setLastReads(getHymnsInLastReads(res));
    } catch (error) {
      console.error("Erreur dans getLastReads", error);
    }
  }

  async function addNewFavorite(id: string) {
    try {
      await controller.addNewFavorite(id);
      getFavorites();
    } catch (error) {
      console.error("Erreur dans addNewFavorite", error);
    }
  }

  async function removeFavorite(id: string) {
    try {
      await controller.removeFavorite(id);
      getFavorites();
    } catch (error) {
      console.error("Erreur dans removeFavorite", error);
    }
  }

  async function toggleFavorite(id: string) {
    const existing = favorites.some((f) => f.id === id);
    try {
      existing ? await removeFavorite(id) : await addNewFavorite(id);
    } catch (error) {
      console.error("Erreur dans toggleFavorite", error);
    }
  }

  function isFavorite(id: string): boolean {
    return favorites.some((f) => f.id === id);
  }

  async function addNewLastRead(id: string) {
    try {
      await controller.addNewLastRead(id);
      getLastReads();
    } catch (error) {
      console.error("Erreur dans addNewLastRead", error);
    }
  }

  function removeLastRead(id: string) {
    try {
      controller.removeLastRead(id);
      getLastReads();
    } catch (error) {
      console.error("Erreur dans removeLastRead", error);
    }
  }

  function updateLastRead(id: string) {
    try {
      controller.updateLastRead(id);
      getLastReads();
    } catch (error) {
      console.error("Erreur dans updateLastRead", error);
    }
  }

  async function toggleLastRead(id: string) {
    const existing = lastReads.some((f) => f.id === id);

    try {
      if (existing) {
        updateLastRead(id);
      } else {
        const raw = (await controller.getLastReads()) as LastReads[];

        if (raw.length >= 5) {
          const oldest = raw.reduce((a, b) =>
            a.read_at < b.read_at ? a : b
          );

          if (oldest.hymn_id !== id) {
            await controller.removeLastRead(oldest.hymn_id);
          }
        }

        await addNewLastRead(id);
      }

      getLastReads();
    } catch (error) {
      console.error("Erreur dans toggleLastRead", error);
    }
  }

  useEffect(() => {
    async function setup() {
      await initDB(db);
      getFavorites();
      getLastReads();
    }

    setup();
  }, [db]);

  const value = useMemo(
    () => ({
      favorites,
      lastReads,

      isFavorite,
      toggleFavorite,
      addNewFavorite,
      removeFavorite,
      addNewLastRead,
      removeLastRead,
      toggleLastRead,
    }),
    [favorites, lastReads]
  );

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

export function useDB() {
  const context = useContext(DBContext);

  if (!context) {
    throw new Error("useDB doit être utilisé dans DBProvider");
  }

  return context;
}