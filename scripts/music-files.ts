import { Hymn } from "@/types/hymn";
import { Directory, File, Paths } from "expo-file-system";

const musicDir = new Directory(Paths.document, "music");

function ensureDir() {
  if (!musicDir.exists) musicDir.create({ intermediates: true, idempotent: true });
}

function extOf(url: string) {
  const m = url.split("?")[0].match(/\.(mp3|m4a|wav|ogg)$/i);
  return m ? m[1].toLowerCase() : "mp3";
}

// Map  id de l'hymne -> uri du fichier local
export function getDownloadedMap(): Map<string, string> {
  ensureDir();
  const map = new Map<string, string>();
  for (const item of musicDir.list()) {
    if (item instanceof File) {
      map.set(item.name.replace(/\.[^.]+$/, ""), item.uri);
    }
  }
  return map;
}

export async function downloadMusic(hymn: Hymn): Promise<string> {
  if (!hymn.music) throw new Error("Aucune musique à télécharger");
  ensureDir();
  const dest = new File(musicDir, `${hymn.id}.${extOf(hymn.music)}`);
  if (dest.exists) dest.delete();
  const file = await File.downloadFileAsync(hymn.music, dest);
  return file.uri;
}

export function deleteMusic(hymnId: string) {
  ensureDir();
  for (const item of musicDir.list()) {
    if (item instanceof File && item.name.replace(/\.[^.]+$/, "") === hymnId) {
      item.delete();
    }
  }
}