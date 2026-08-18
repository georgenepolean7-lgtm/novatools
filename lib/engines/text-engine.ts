export interface TextEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function removeDuplicateLines(input: string, caseSensitive: boolean = true): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const lines = input.split(/\r?\n/);
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLines.push(line);
    }
  }

  return {
    success: true,
    output: uniqueLines.join("\n"),
    breakdown: {
      "Original Lines": lines.length,
      "Unique Lines": uniqueLines.length,
      "Duplicates Removed": lines.length - uniqueLines.length,
    },
  };
}

export function sortLines(input: string, order: "asc" | "desc" = "asc", caseSensitive: boolean = false): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  lines.sort((a, b) => {
    const valA = caseSensitive ? a : a.toLowerCase();
    const valB = caseSensitive ? b : b.toLowerCase();
    return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return {
    success: true,
    output: lines.join("\n"),
    breakdown: {
      "Total Sorted Lines": lines.length,
      "Sort Order": order === "asc" ? "Alphabetical (A → Z)" : "Reverse (Z → A)",
    },
  };
}

export function getWordFrequency(input: string): TextEngineResult {
  if (!input.trim()) return { success: true, output: "" };
  const words = input.toLowerCase().match(/\b[\w'-]+\b/g) || [];
  const freq: Record<string, number> = {};

  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const formatted = sorted.map(([w, count]) => `${w}: ${count} (${((count / words.length) * 100).toFixed(1)}%)`).join("\n");

  return {
    success: true,
    output: formatted,
    breakdown: {
      "Total Words": words.length,
      "Unique Words": sorted.length,
      "Top Word": sorted[0] ? `${sorted[0][0]} (${sorted[0][1]} times)` : "None",
    },
  };
}

export function getCharacterFrequency(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  let vowels = 0;
  let consonants = 0;
  let digits = 0;
  let whitespace = 0;
  let punctuation = 0;

  for (const char of input) {
    if (/[aeiouAEIOU]/.test(char)) vowels++;
    else if (/[a-zA-Z]/.test(char)) consonants++;
    else if (/\d/.test(char)) digits++;
    else if (/\s/.test(char)) whitespace++;
    else punctuation++;
  }

  // Unicode grapheme segmenter
  let graphemesCount = input.length;
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    graphemesCount = Array.from(segmenter.segment(input)).length;
  }

  return {
    success: true,
    output: `Total Grapheme Characters: ${graphemesCount}\nVowels: ${vowels}\nConsonants: ${consonants}\nDigits: ${digits}\nWhitespace: ${whitespace}\nSpecial/Punctuation: ${punctuation}`,
    breakdown: {
      "Total Graphemes": graphemesCount,
      "Vowel Count": vowels,
      "Consonant Count": consonants,
      "Digit Count": digits,
      "Whitespace Count": whitespace,
      "Punctuation / Symbols": punctuation,
    },
  };
}

export function calculateReadingTime(input: string, speedWpm: number = 220): TextEngineResult {
  if (!input.trim()) return { success: true, output: "0 minutes" };
  const words = (input.match(/\b[\w'-]+\b/g) || []).length;
  const chars = input.length;
  const readingMinutes = words / speedWpm;
  const readingSeconds = Math.ceil(readingMinutes * 60);

  const speechMinutes = words / 130;
  const speechSeconds = Math.ceil(speechMinutes * 60);

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return {
    success: true,
    output: `Silent Reading Time: ~${formatMinSec(readingSeconds)}\nSpeech / Audio Duration: ~${formatMinSec(speechSeconds)}`,
    breakdown: {
      "Total Words": words,
      "Total Characters": chars,
      "Silent Reading (~220 WPM)": formatMinSec(readingSeconds),
      "Speaking Duration (~130 WPM)": formatMinSec(speechSeconds),
    },
  };
}

export function reverseText(input: string, mode: "character" | "words" | "lines" = "character"): TextEngineResult {
  if (!input) return { success: true, output: "" };
  if (mode === "words") {
    const reversedWords = input.split(/\s+/).reverse().join(" ");
    return { success: true, output: reversedWords };
  }
  if (mode === "lines") {
    const reversedLines = input.split(/\r?\n/).reverse().join("\n");
    return { success: true, output: reversedLines };
  }
  const reversedChars = Array.from(input).reverse().join("");
  return { success: true, output: reversedChars };
}

export function slugifyText(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const slug = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    success: true,
    output: slug,
    breakdown: {
      "Slug Character Length": slug.length,
      "Status": "SEO & URL-Ready ✓",
    },
  };
}

export function findAndReplace(
  input: string,
  findStr: string,
  replaceStr: string,
  isRegex: boolean = false,
  matchCase: boolean = false,
  wholeWord: boolean = false
): TextEngineResult {
  if (!input || !findStr) return { success: true, output: input };
  try {
    let pattern = findStr;
    if (!isRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = matchCase ? "g" : "gi";
    const regex = new RegExp(pattern, flags);
    const matches = (input.match(regex) || []).length;
    const output = input.replace(regex, replaceStr);

    return {
      success: true,
      output,
      breakdown: {
        "Replacements Made": matches,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: input, error: err instanceof Error ? err.message : "Regex error" };
  }
}

export function removeEmptyLines(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const original = input.split(/\r?\n/);
  const filtered = original.filter((l) => l.trim().length > 0);

  return {
    success: true,
    output: filtered.join("\n"),
    breakdown: {
      "Original Lines": original.length,
      "Remaining Lines": filtered.length,
      "Empty Lines Removed": original.length - filtered.length,
    },
  };
}

export function prefixSuffixLines(
  input: string,
  prefix: string = "",
  suffix: string = "",
  addLineNumbers: boolean = false
): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const lines = input.split(/\r?\n/);
  const modified = lines.map((l, idx) => {
    const num = addLineNumbers ? `${idx + 1}. ` : "";
    return `${num}${prefix}${l}${suffix}`;
  });

  return {
    success: true,
    output: modified.join("\n"),
    breakdown: { "Total Lines Modified": lines.length },
  };
}

export function extractEmails(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = input.match(emailRegex) || [];
  const unique = Array.from(new Set(matches.map((e) => e.toLowerCase())));

  return {
    success: true,
    output: unique.join("\n"),
    breakdown: {
      "Total Emails Found": matches.length,
      "Unique Emails": unique.length,
    },
  };
}

export function extractUrls(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const urlRegex = /\bhttps?:\/\/[^\s"'<>]+/gi;
  const matches = input.match(urlRegex) || [];
  const unique = Array.from(new Set(matches));

  return {
    success: true,
    output: unique.join("\n"),
    breakdown: {
      "Total URLs Extracted": matches.length,
      "Unique URLs": unique.length,
    },
  };
}

export function extractNumbers(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const numRegex = /[-+]?\b\d+(?:\.\d+)?\b/g;
  const matches = input.match(numRegex) || [];

  return {
    success: true,
    output: matches.join("\n"),
    breakdown: {
      "Total Numbers Found": matches.length,
    },
  };
}

export function convertToCamelCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const words = input.trim().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return { success: true, output: "" };

  const camel = words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");

  return { success: true, output: camel };
}

export function convertToSnakeCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const snake = input
    .trim()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
    .join("_");

  return { success: true, output: snake };
}

export function convertToKebabCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const kebab = input
    .trim()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
    .join("-");

  return { success: true, output: kebab };
}

export function convertToPascalCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const pascal = input
    .trim()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  return { success: true, output: pascal };
}

export function convertToTitleCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const smallWords = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "in", "of"]);
  const words = input.toLowerCase().split(/\s+/);

  const title = words
    .map((w, i) => {
      if (i === 0 || i === words.length - 1 || !smallWords.has(w)) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }
      return w;
    })
    .join(" ");

  return { success: true, output: title };
}

export function convertToSentenceCase(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const sentences = input.toLowerCase().split(/([.!?]\s*)/);
  const sentence = sentences
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  return { success: true, output: sentence };
}

export function convertToMorseCode(input: string, mode: "encode" | "decode" = "encode"): TextEngineResult {
  const morseMap: Record<string, string> = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
    I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
    Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
    6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----", " ": "/"
  };
  const reverseMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(morseMap)) {
    reverseMap[v] = k;
  }

  if (mode === "encode") {
    const encoded = input
      .toUpperCase()
      .split("")
      .map((c) => morseMap[c] || c)
      .join(" ");
    return { success: true, output: encoded };
  } else {
    const decoded = input
      .trim()
      .split(" ")
      .map((c) => reverseMap[c] || (c === "/" ? " " : ""))
      .join("");
    return { success: true, output: decoded };
  }
}

export function convertTextToBinary(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const bytes = Array.from(new TextEncoder().encode(input));
  const binary = bytes.map((b) => b.toString(2).padStart(8, "0")).join(" ");
  return { success: true, output: binary, breakdown: { "Total Bytes Encoded": bytes.length } };
}

export function convertBinaryToText(binaryStr: string): TextEngineResult {
  try {
    const clean = binaryStr.trim().replace(/[^01]/g, "");
    if (clean.length % 8 !== 0) {
      return { success: false, output: "", error: "Binary string length must be a multiple of 8 bits." };
    }
    const bytes = new Uint8Array(clean.length / 8);
    for (let i = 0; i < clean.length; i += 8) {
      bytes[i / 8] = parseInt(clean.substring(i, i + 8), 2);
    }
    const decoded = new TextDecoder().decode(bytes);
    return { success: true, output: decoded };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Binary decoding failed" };
  }
}

export function convertToNatoPhonetic(input: string): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const natoMap: Record<string, string> = {
    A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
    G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
    M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
    S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
    Y: "Yankee", Z: "Zulu", "0": "Zero", "1": "One", "2": "Two", "3": "Three",
    "4": "Four", "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
  };

  const output = input
    .toUpperCase()
    .split("")
    .map((c) => natoMap[c] || c)
    .join(" ");

  return { success: true, output };
}

export function normalizeUnicode(input: string, form: "NFC" | "NFD" | "NFKC" | "NFKD" = "NFC"): TextEngineResult {
  if (!input) return { success: true, output: "" };
  const normalized = input.normalize(form);
  return {
    success: true,
    output: normalized,
    breakdown: {
      "Original Code Units": input.length,
      "Normalized Code Units": normalized.length,
      "Normalization Form": form,
    },
  };
}

export function generateMarkdownTable(rows: number = 3, cols: number = 3): TextEngineResult {
  const r = Math.max(1, Math.min(rows, 50));
  const c = Math.max(1, Math.min(cols, 20));

  const headers = Array.from({ length: c }, (_, i) => `Header ${i + 1}`);
  const separator = Array.from({ length: c }, () => `---`);

  const headerLine = `| ${headers.join(" | ")} |`;
  const sepLine = `| ${separator.join(" | ")} |`;

  const bodyLines = Array.from({ length: r }, (_, rowIdx) => {
    const cells = Array.from({ length: c }, (_, colIdx) => `Data ${rowIdx + 1}.${colIdx + 1}`);
    return `| ${cells.join(" | ")} |`;
  });

  const fullTable = [headerLine, sepLine, ...bodyLines].join("\n");

  return {
    success: true,
    output: fullTable,
    breakdown: {
      "Columns": c,
      "Data Rows": r,
      "Total Cells": r * c,
      "Format": "GitHub Flavored Markdown (GFM) Table",
    },
  };
}

