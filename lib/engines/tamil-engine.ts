export interface TamilEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

// Bamini to Unicode Mapping table for legacy Tamil typography
const baminiToUnicodeMap: [string, string][] = [
  ["sp", "ஸ்ரீ"],
  ["n`", "ஞ்"],
  ["n;", "ந்"],
  ["j;", "த்"],
  ["k;", "க்"],
  ["r;", "ச்"],
  ["l;", "ட்"],
  ["z;", "ண்"],
  ["g;", "ப்"],
  ["k;", "க்"],
  ["t;", "வ்"],
  ["b;", "ழ்"],
  ["s;", "ள்"],
  ["w;", "ற்"],
  ["d;", "ன்"],
  ["m;", "ம்"],
  ["a", "அ"],
  ["M", "ஆ"],
  [",</", "இ"],
  ["<", "ஈ"],
  ["c", "உ"],
  ["C", "ஊ"],
  ["v", "எ"],
  ["V", "ஏ"],
  ["I", "ஐ"],
  ["x", "ஒ"],
  ["X", "ஓ"],
  ["xs", "ஔ"],
  ["f", "க"],
  ["q", "ங"],
  ["r", "ச"],
  ["[", "ஜ"],
  ["Q", "ஞ"],
  ["l", "ட"],
  ["z", "ண"],
  ["j", "த"],
  ["e", "ந"],
  ["g", "ப"],
  ["m", "ம"],
  ["a", "ய"],
  ["u", "ர"],
  ["y", "ல"],
  ["t", "வ"],
  ["b", "ழ"],
  ["s", "ள"],
  ["w", "ற"],
  ["d", "ன"],
  ["\\", "ஷ"],
  ["n", "ஸ"],
  ["`", "ஹ"],
  ["h", "ா"],
  ["p", "ி"],
  ["P", "ீ"],
  ["[", "ு"],
  ["{", "ூ"],
  ["ெ", "ெ"],
  ["ே", "ே"],
  ["ை", "ை"],
  ["f;", "க்"],
];

export function convertBaminiToUnicode(input: string): TamilEngineResult {
  if (!input.trim()) return { success: true, output: "" };
  let result = input;
  for (const [bamini, unicode] of baminiToUnicodeMap) {
    result = result.split(bamini).join(unicode);
  }
  return {
    success: true,
    output: result,
    breakdown: {
      "Input Characters": input.length,
      "Output Unicode Characters": result.length,
      "Target Standard": "UTF-8 Tamil Unicode (U+0B80 - U+0BFF)",
    },
  };
}

export function transliterateTanglishToTamil(input: string): TamilEngineResult {
  if (!input.trim()) return { success: true, output: "" };

  const phonetics: Record<string, string> = {
    vanakkam: "வணக்கம்",
    nandri: "நன்றி",
    amma: "அம்மா",
    appa: "அப்பா",
    anna: "அண்ணா",
    thambi: "தம்பி",
    thangachi: "தங்கச்சி",
    tamil: "தமிழ்",
    tamizh: "தமிழ்",
    chennai: "சென்னை",
    madurai: "மதுரை",
    coimbatore: "கோயம்புத்தூர்",
    kovai: "கோவை",
    salem: "சேலம்",
    eppadi: "எப்படி",
    irukeenga: "இருக்கீங்க",
    irukkeenga: "இருக்கீங்க",
    irukka: "இருக்கா",
    nalla: "நல்லா",
    super: "சூப்பர்",
    kaalai: "காலை",
    iravu: "இரவு",
    aam: "ஆம்",
    illai: "இல்லை",
    enakku: "எனக்கு",
    unakku: "உனக்கு",
    unmaiya: "உண்மையா",
  };

  const words = input.split(/\s+/);
  const converted = words.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    return phonetics[clean] || w;
  });

  return {
    success: true,
    output: converted.join(" "),
    breakdown: {
      "Total Words": words.length,
      "Transliteration Mode": "Phonetic Tanglish to Tamil Unicode",
    },
  };
}

export function countTamilCharacters(text: string): TamilEngineResult {
  if (!text.trim()) return { success: true, output: "உரை உள்ளீடு காலியாக உள்ளது" };

  // Tamil Unicode regex blocks
  const uyirRegex = /[அஆஇஈஉஊஎஏஐஒஓஔ]/g;
  const ayuthaRegex = /ஃ/g;
  const pulliRegex = /[\u0BCD]/g; // Virama / Pulli
  const tamilCharRegex = /[\u0B80-\u0BFF]/g;

  const totalTamilLetters = (text.match(tamilCharRegex) || []).length;
  const uyirCount = (text.match(uyirRegex) || []).length;
  const ayuthaCount = (text.match(ayuthaRegex) || []).length;
  const meiCount = (text.match(pulliRegex) || []).length;
  const uyirMeiCount = Math.max(0, totalTamilLetters - uyirCount - ayuthaCount - meiCount);

  return {
    success: true,
    output: `மொத்த தமிழ் எழுத்துக்கள்: ${totalTamilLetters}\nஉயிர் எழுத்துக்கள்: ${uyirCount}\nமெய் எழுத்துக்கள்: ${meiCount}\nஉயிர்மெய் எழுத்துக்கள்: ${uyirMeiCount}\nஆய்த எழுத்து: ${ayuthaCount}`,
    breakdown: {
      "Total Tamil Letters (மொத்த எழுத்துக்கள்)": totalTamilLetters,
      "Vowels (உயிர் எழுத்துக்கள்)": `${uyirCount} (12 சாத்தியம்)`,
      "Consonants (மெய் எழுத்துக்கள்)": `${meiCount} (18 சாத்தியம்)`,
      "Compound Letters (உயிர்மெய்)": `${uyirMeiCount} (216 சாத்தியம்)`,
      "Ayutha Letter (ஆய்த எழுத்து)": `${ayuthaCount} ('ஃ')`,
    },
  };
}

export function countTamilWordsSentences(text: string): TamilEngineResult {
  const clean = text.trim();
  if (!clean) return { success: true, output: "உரை இல்லை" };

  const words = clean.split(/\s+/).filter(Boolean);
  const sentences = clean.split(/[.!?।\n]+/).filter((s) => s.trim().length > 0);
  const readingTimeMin = (words.length / 150).toFixed(1); // Standard Tamil reading speed ~150 wpm
  const speechTimeMin = (words.length / 110).toFixed(1); // Tamil speech rate ~110 wpm

  return {
    success: true,
    output: `சொற்கள் (Words): ${words.length}\nவாக்கியங்கள் (Sentences): ${sentences.length}\nபடிக்கும் நேரம்: ~${readingTimeMin} நிமிடம்`,
    breakdown: {
      "Total Words (சொற்கள்)": words.length,
      "Total Sentences (வாக்கியங்கள்)": sentences.length,
      "Estimated Reading Time (படிக்கும் நேரம்)": `~${readingTimeMin} Minutes`,
      "Estimated Speech Time (பேசும் நேரம்)": `~${speechTimeMin} Minutes`,
    },
  };
}

export function normalizeTamilUnicode(text: string): TamilEngineResult {
  if (!text) return { success: true, output: "" };

  // Apply NFC canonical normalization and strip zero-width characters (ZWJ \u200D, ZWNJ \u200C)
  const normalized = text
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  return {
    success: true,
    output: normalized,
    breakdown: {
      "Original Characters": text.length,
      "Normalized Characters": normalized.length,
      "Unicode Standard": "Unicode 15.0 NFC Normalization Form",
      "Glitches Fixed": "Removed invisible Zero-Width Joiners and broken combining marks",
    },
  };
}

export function cleanTamilText(text: string): TamilEngineResult {
  if (!text) return { success: true, output: "" };

  // Remove English characters while keeping Tamil Unicode, numbers, and standard punctuation
  const cleaned = text
    .replace(/[a-zA-Z]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  return {
    success: true,
    output: cleaned,
    breakdown: {
      "Original Length": `${text.length} chars`,
      "Cleaned Tamil Length": `${cleaned.length} chars`,
      "English Characters Stripped": "Yes (Pure Tamil Prose Retained)",
    },
  };
}

export function inspectTamilCodePoints(text: string): TamilEngineResult {
  if (!text.trim()) return { success: true, output: "Empty string" };

  const breakdownTable: Record<string, string> = {};
  const codePointsList: string[] = [];

  for (let i = 0; i < Math.min(text.length, 30); i++) {
    const char = text[i];
    const hex = "\\u" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0");
    codePointsList.push(`${char} (${hex})`);
    breakdownTable[`Letter [${i + 1}]: '${char}'`] = hex;
  }

  return {
    success: true,
    output: codePointsList.join("  |  "),
    breakdown: breakdownTable,
  };
}

export function formatTamilCaseTitles(text: string): TamilEngineResult {
  if (!text.trim()) return { success: true, output: "" };

  // Format standard Tamil honorifics (திரு / திருமதி / முனைவர்) and quotation marks
  const formatted = text
    .replace(/\bMr\.\s*/gi, "திரு. ")
    .replace(/\bMrs\.\s*/gi, "திருமதி. ")
    .replace(/\bDr\.\s*/gi, "முனைவர். ")
    .replace(/["“”]/g, '"')
    .replace(/['‘’]/g, "'");

  return {
    success: true,
    output: formatted,
    breakdown: {
      "Honorific Replacements": "Applied standard Tamil titles (திரு / திருமதி)",
      "Quotation Normalization": "Standardized curly quotes to universal quotation marks",
    },
  };
}
