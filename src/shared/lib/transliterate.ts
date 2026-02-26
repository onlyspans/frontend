const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya'
};

function isCyrillic(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x0400 && code <= 0x04ff) || (code >= 0x0500 && code <= 0x052f);
}

export function transliterate(text: string): string {
  const lower = text.toLowerCase();
  let result = '';
  for (let i = 0; i < lower.length; i++) {
    const char = lower[i];
    const mapped = CYRILLIC_TO_LATIN[char];
    if (mapped !== undefined) {
      result += mapped;
    } else if (isCyrillic(char)) {
      result += char;
    } else {
      result += char;
    }
  }
  return result;
}

export function nameToSlug(name: string): string {
  if (!name || !name.trim()) return '';
  const transliterated = transliterate(name.trim());
  return transliterated
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
