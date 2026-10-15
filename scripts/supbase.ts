import { Hymn, Track } from '@/types/hymn';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key must be configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ParsedTitle = {
  number: number | null;
  year: number | null;
  title: string;
};

export function parseTrackName(fileName: string): ParsedTitle {
  const base = fileName.replace(/\.[^.]+$/, '');

  const match = base.match(/^(\d+)(?:_((?:19|20)\d{2}))?_(.+)$/);

  if (!match) {
    return { number: null, year: null, title: base.replace(/_/g, ' ') };
  }

  return {
    number: Number(match[1]),
    year: match[2] ? Number(match[2]) : null,
    title: match[3].replace(/_/g, ' '),
  };
}

export async function getTracks(): Promise<Track[]> {
  const { data, error } = await supabase.storage.from('hira-jm').list('', {
    limit: 200,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error) throw error;

  return data
    .filter((f) => f.name.match(/\.(mp3|m4a|wav|ogg)$/i))
    .map((f) => {
      const { number, year, title } = parseTrackName(f.name);
      return {
        id: f.id ?? f.name,
        number,
        year,
        title,
        url: supabase.storage.from('hira-jm').getPublicUrl(f.name).data.publicUrl,
      };
    });
}

export async function attachMusic(hymns: Hymn[]): Promise<Hymn[]> {
  const tracks: Track[] = await getTracks();
  const byNumber = new Map<number, Track[]>();
  for (const t of tracks) {
    if (t.number == null) continue;
    const list = byNumber.get(t.number) ?? [];
    list.push(t);
    byNumber.set(t.number, list);
  }

  return hymns.map((h) => {
    const candidates = byNumber.get(h.number);
    if (!candidates?.length) return h;

    const best =
      candidates.find((t) => t.year != null && String(t.year) === h.year) ??
      candidates[0];

    return { ...h, music: best.url };
  });
}