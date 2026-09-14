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

export const categoryMap: Record<string, string> = {
  // Finoana sy Fitokisana
  "Finoana": "Finoana sy Fitokisana",
  "finoana": "Finoana sy Fitokisana",
  "Finoana sy Faharetana": "Finoana sy Fitokisana",
  "Finoana sy Fitokiana": "Finoana sy Fitokisana",
  "Fitokiana amin'Andriamanitra": "Finoana sy Fitokisana",
  "Fitokiana amin'i Jesosy": "Finoana sy Fitokisana",
  "fitokisana": "Finoana sy Fitokisana",

  // Famonjena sy Fibebahana
  "Famonjena": "Famonjena sy Fibebahana",
  "famonjena": "Famonjena sy Fibebahana",
  "Fibebahana": "Famonjena sy Fibebahana",
  "fibebahana": "Famonjena sy Fibebahana",
  "Fibebahana sy Famindram-po": "Famonjena sy Fibebahana",
  "Fibebahana sy Fifaliana": "Famonjena sy Fibebahana",
  "Fibebahana sy Fiverenana": "Famonjena sy Fibebahana",
  "Fanavotana": "Famonjena sy Fibebahana",
  "Fanadiovana sy Famonjena": "Famonjena sy Fibebahana",
  "Fanadiovana sy Fanamasinana": "Famonjena sy Fibebahana",

  // Fitiavana
  "Fitiavana": "Fitiavana",
  "fitiavana": "Fitiavana",
  "Fitiavan'Andriamanitra": "Fitiavana",
  "Fitiavan'i Kristy": "Fitiavana",
  "Fitiavana an'i Jesosy": "Fitiavana",
  "Fifankatiavana": "Fitiavana",

  // Vavaka
  "Vavaka": "Vavaka",
  "vavaka": "Vavaka",
  "Vavaka sy Fangatahana": "Vavaka",
  "Vavaka sy Fanoloran-tena": "Vavaka",
  "fivavahana": "Vavaka",
  "fifonana": "Vavaka",

  // Fiderana
  "Fiderana": "Fiderana sy Fifaliana",
  "fiderana": "Fiderana sy Fifaliana",
  "Fiderana sy Fisaorana": "Fiderana sy Fifaliana",
  "Fifaliana": "Fiderana sy Fifaliana",
  "fifaliana": "Fiderana sy Fifaliana",
  "fankalazana": "Fiderana sy Fifaliana",

  // Fiainana Kristiana
  "Fiainana kristiana": "Fiainana Kristiana",
  "Fiainana masina": "Fiainana Kristiana",
  "Fiainana vaovao": "Fiainana Kristiana",
  "Fahamarinana": "Fiainana Kristiana",
  "fahamarinana": "Fiainana Kristiana",
  "Fahamasinana": "Fiainana Kristiana",
  "fahamasinana": "Fiainana Kristiana",
  "Fanetren-tena": "Fiainana Kristiana",
  "Fanokanana ny tena": "Fiainana Kristiana",
  "fanoloran-tena": "Fiainana Kristiana",

  // Fanompoana sy Fitoriana
  "Fanompoana": "Fanompoana sy Fitoriana",
  "fanompoana": "Fanompoana sy Fitoriana",
  "Fanompoana sy Faharetana": "Fanompoana sy Fitoriana",
  "Fanompoana sy Fanekena": "Fanompoana sy Fitoriana",
  "Fitoriana Filazantsara": "Fanompoana sy Fitoriana",
  "Fitoriana": "Fanompoana sy Fitoriana",
  "fitoriana": "Fanompoana sy Fitoriana",
  "filazantsara": "Fanompoana sy Fitoriana",
  "Fampianarana": "Fanompoana sy Fitoriana",
  "fampianarana": "Fanompoana sy Fitoriana",

  // Fampaherezana sy Fanantenana
  "Fampaherezana": "Fampaherezana sy Fanantenana",
  "fampaherezana": "Fampaherezana sy Fanantenana",
  "Fampiononana sy Fitsaharana": "Fampaherezana sy Fanantenana",
  "Fiarovana sy Fampiononana": "Fampaherezana sy Fanantenana",
  "Fiarovana sy Fitokiana": "Fampaherezana sy Fanantenana",
  "Fanantenana": "Fampaherezana sy Fanantenana",
  "fanantenana": "Fampaherezana sy Fanantenana",
  "Hery": "Fampaherezana sy Fanantenana",
  "hery": "Fampaherezana sy Fanantenana",
  "Tsodrano": "Fampaherezana sy Fanantenana",
  "tsodrano": "Fampaherezana sy Fanantenana",

  // Jesosy Kristy
  "Fanarahana an'i Jesosy": "Jesosy Kristy",
  "Fijalian'i Kristy": "Jesosy Kristy",
  "fijalian'i Kristy": "Jesosy Kristy",
  "Fiverenan'i Jesosy": "Jesosy Kristy",
  "Fandresena ara-panahy": "Jesosy Kristy",
  "fandresena": "Jesosy Kristy",

  // Lohahevitra ara-Baiboly
  "Ady ara-panahy": "Lohahevitra ara-Baiboly",
  "Fanahy Masina": "Lohahevitra ara-Baiboly",
  "Fanavaozana ara-panahy": "Lohahevitra ara-Baiboly",
  "Fifohazana": "Lohahevitra ara-Baiboly",
  "Fijinjana sy Fitsarana": "Lohahevitra ara-Baiboly",
  "Fahafatesana sy Fitsanganana": "Lohahevitra ara-Baiboly",
  "Lanitra sy Fiainana mandrakizay": "Lohahevitra ara-Baiboly",
  "Baiboly": "Lohahevitra ara-Baiboly",
  "Noely": "Lohahevitra ara-Baiboly",
  "noely": "Lohahevitra ara-Baiboly",
  "Tanora": "Lohahevitra ara-Baiboly",
  "tanora": "Lohahevitra ara-Baiboly",
};

export function getMainCategory(category?: string | null): string {
  if (!category) return "Autres";

  return categoryMap[category] ?? "Autres";
}