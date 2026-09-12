import { Hymn } from "./hymn";

export interface DBContextType {
  favorites: Hymn[];
  lastReads: Hymn[];

  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addNewFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;

  addNewLastRead: (id: string) => void;
  removeLastRead: (id: string) => void;
  toggleLastRead: (id: string) => void;
}

export interface Favorite {
  id: string;
  hymn_id: string;
  created_at: string;
  updated_at: string;
}

export interface LastReads {
  id: string;
  hymn_id: string;
  read_at: string;
  updated_at: string;
}