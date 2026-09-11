export interface Hymn {
  id: string;
  number: number;
  title: string;
  category: string;
  keySig: string;
  year: string;
  collection: string;
  content: string;
}

export interface HymnVerse {
  number: number | null;
  text: string;
  isRefrain: boolean;
}