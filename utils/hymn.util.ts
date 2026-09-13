import hymnes from '@/assets/json/fihirana_jm.json';

export function wrapTextAroundWord(
  text: string,
  searchTerm: string,
  wordsAround: number = 5
): string {
  if (!text.trim()) return "";

  const flatText = text.replace(/\s+/g, " ").trim();

  // Si aucune recherche n'est fournie :
  // retourner les `wordsAround * 2` premiers mots
  if (!searchTerm.trim()) {
    const words = flatText.split(" ");
    const limit = wordsAround * 2;

    if (words.length <= limit) {
      return flatText;
    }

    return `${words.slice(0, limit).join(" ")} ...`;
  }

  const lowerText = flatText.toLowerCase();
  const lowerTerm = searchTerm.trim().toLowerCase();
  const matchIndex = lowerText.indexOf(lowerTerm);

  if (matchIndex === -1) {
    const words = flatText.split(" ");
    const limit = wordsAround * 2;

    if (words.length <= limit) {
      return flatText;
    }

    return `${words.slice(0, limit).join(" ")} ...`;
  }

  const words = flatText.split(" ");
  let charCount = 0;
  let matchWordIndex = -1;

  for (let i = 0; i < words.length; i++) {
    const wordStart = charCount;
    const wordEnd = wordStart + words[i].length;

    if (matchIndex >= wordStart && matchIndex <= wordEnd) {
      matchWordIndex = i;
      break;
    }

    charCount = wordEnd + 1;
  }

  if (matchWordIndex === -1) {
    const limit = wordsAround * 2;

    if (words.length <= limit) {
      return flatText;
    }

    return `${words.slice(0, limit).join(" ")} ...`;
  }

  const start = Math.max(0, matchWordIndex - wordsAround);
  const end = Math.min(
    words.length,
    matchWordIndex + wordsAround + 1
  );

  const snippet = words.slice(start, end).join(" ");

  const prefix = start > 0 ? "... " : "";
  const suffix = end < words.length ? " ..." : "";

  return `${prefix}${snippet}${suffix}`;
}

export function formatNumber(num: number): string {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function uncapitalizeFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

export function searchHymn(search: string) {
  const query = search.trim().toLowerCase();

  const result = hymnes.filter((hymn) => {
    const content = formatContent(hymn.content);
    return (
      String(hymn.number).includes(query) ||
      hymn.title.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query)
    );
  });

  const resultFormat = result.map((hymn) => ({
    ...hymn,
    content: wrapTextAroundWord(formatContent(hymn.content), query, 3),
  }))

  return resultFormat.sort((a, b) => a.number - b.number);
}

export function formatContent(content: string) {
  if (!content) return "";

  return content
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function formatContentString(content: string) {
  if (!content) return "";

  return content
    .replace(/\\n/g, " ")
    .replace(/\r\n/g, " ")
    .replace(/[ \t]+\n/g, " ")
    .trim();
}

export type HymnBlockKind = "verse" | "refrain";

export interface HymnBlock {
  kind: HymnBlockKind;
  number: number | null;
  label: string | null;
  text: string;
  lines: string[];
}

const VERSE_PREFIX = /^(\d+)\s*-\s*/;

const REFRAIN_LABELS = ["isan'andininy", "fiverenana", "refrain"];

export function parseHymnContent(raw: string): HymnBlock[] {
  const normalized = formatContent(raw);

  const blocks = normalized
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block): HymnBlock => {
    const verseMatch = block.match(VERSE_PREFIX);

    if (verseMatch) {
      const number = parseInt(verseMatch[1], 10);
      const text = block.slice(verseMatch[0].length).trim();

      return {
        kind: "verse",
        number,
        label: null,
        text,
        lines: text.split("\n").map((l) => l.trim()).filter(Boolean),
      };
    }

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] ?? "";
    const isKnownLabel = REFRAIN_LABELS.includes(firstLine.toLowerCase());

    const label = isKnownLabel ? firstLine : null;
    const contentLines = isKnownLabel ? lines.slice(1) : lines;

    return {
      kind: "refrain",
      number: null,
      label,
      text: contentLines.join("\n"),
      lines: contentLines,
    };
  });
}