import hymnes from '@/assets/json/fihirana_jm.json';
import { HymnVerse } from '@/types/hymn';

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

export function parseHymnContent(content: string): HymnVerse[] {
  const formatted = formatContent(content);

  const blocks = formatted
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const match = block.match(/^(\d+)\s*-\s*/);

    if (match) {
      const number = parseInt(match[1], 10);
      const text = block.replace(/^(\d+)\s*-\s*/, "").trim();

      return {
        number,
        text,
        isRefrain: false,
      };
    }

    return {
      number: null,
      text: block,
      isRefrain: true,
    };
  });
}