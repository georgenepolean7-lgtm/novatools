export interface DeveloperEngineResult {
  success: boolean;
  output: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export function formatJson(input: string, indent: number = 2): DeveloperEngineResult {
  try {
    if (!input.trim()) return { success: true, output: "" };
    const parsed = JSON.parse(input);
    return {
      success: true,
      output: JSON.stringify(parsed, null, indent),
      metadata: { keys: Object.keys(parsed).length, type: Array.isArray(parsed) ? "Array" : typeof parsed },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid JSON syntax" };
  }
}

export function minifyJson(input: string): DeveloperEngineResult {
  try {
    if (!input.trim()) return { success: true, output: "" };
    const parsed = JSON.parse(input);
    return { success: true, output: JSON.stringify(parsed) };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid JSON syntax" };
  }
}

export function validateJson(input: string): DeveloperEngineResult {
  try {
    if (!input.trim()) return { success: true, output: "Empty JSON" };
    JSON.parse(input);
    return { success: true, output: "Valid JSON syntax ✓" };
  } catch (err: unknown) {
    return { success: false, output: "Invalid JSON syntax", error: err instanceof Error ? err.message : "Syntax Error" };
  }
}

export function formatSql(input: string): DeveloperEngineResult {
  if (!input.trim()) return { success: true, output: "" };
  const keywords = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "CROSS JOIN",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
    "ALTER TABLE", "DROP TABLE", "UNION", "UNION ALL", "AND", "OR", "ON"
  ];
  let formatted = input.replace(/\s+/g, " ").trim();
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${kw}`);
  });
  const lines = formatted.split("\n").map((l) => l.trim()).filter(Boolean);
  return { success: true, output: lines.join("\n") };
}

export function decodeJwt(token: string): DeveloperEngineResult {
  try {
    if (!token.trim()) return { success: true, output: "" };
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return { success: false, output: "", error: "JWT must contain 3 dot-separated parts (Header.Payload.Signature)" };
    }
    const b64Decode = (str: string) => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    };

    const header = b64Decode(parts[0]);
    const payload = b64Decode(parts[1]);
    return {
      success: true,
      output: JSON.stringify({ Header: header, Payload: payload }, null, 2),
      metadata: {
        algorithm: header.alg,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : "None",
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : "None",
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Failed to decode JWT payload" };
  }
}

export function encodeBase64(input: string): DeveloperEngineResult {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return { success: true, output: encoded };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Base64 encoding failed" };
  }
}

export function decodeBase64(input: string): DeveloperEngineResult {
  try {
    const decoded = decodeURIComponent(escape(atob(input.trim())));
    return { success: true, output: decoded };
  } catch {
    return { success: false, output: "", error: "Invalid Base64 string" };
  }
}

export function encodeUrl(input: string): DeveloperEngineResult {
  return { success: true, output: encodeURIComponent(input) };
}

export function decodeUrl(input: string): DeveloperEngineResult {
  try {
    return { success: true, output: decodeURIComponent(input) };
  } catch {
    return { success: false, output: "", error: "Malformed URL encoded sequence" };
  }
}

export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function computeHash(input: string, algorithm: "SHA-256" | "SHA-512" | "SHA-1" = "SHA-256"): Promise<DeveloperEngineResult> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { success: true, output: hashHex };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Hash computation failed" };
  }
}

export function testRegex(pattern: string, flags: string, text: string): DeveloperEngineResult {
  try {
    if (!pattern) return { success: true, output: "Enter a regular expression pattern to test." };
    const regex = new RegExp(pattern, flags);
    const matches: string[] = [];
    let match;
    if (flags.includes("g")) {
      while ((match = regex.exec(text)) !== null) {
        matches.push(`Match [${match.index}-${match.index + match[0].length}]: "${match[0]}"`);
        if (regex.lastIndex === match.index) regex.lastIndex++;
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push(`Match [${match.index}-${match.index + match[0].length}]: "${match[0]}"`);
      }
    }
    return {
      success: true,
      output: matches.length > 0 ? matches.join("\n") : "No matches found.",
      metadata: { count: matches.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid regular expression" };
  }
}

export function convertTimestamp(timestampStr: string): DeveloperEngineResult {
  try {
    const num = Number(timestampStr.trim());
    if (isNaN(num)) return { success: false, output: "", error: "Please enter a valid numeric Unix timestamp" };
    const date = num > 1e11 ? new Date(num) : new Date(num * 1000);
    if (isNaN(date.getTime())) return { success: false, output: "", error: "Invalid date" };
    return {
      success: true,
      output: date.toISOString(),
      metadata: {
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        epochSeconds: Math.floor(date.getTime() / 1000),
        epochMs: date.getTime(),
      },
    };
  } catch {
    return { success: false, output: "", error: "Timestamp conversion error" };
  }
}

export function minifyHtml(html: string): DeveloperEngineResult {
  if (!html.trim()) return { success: true, output: "" };
  const minified = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
  return { success: true, output: minified, metadata: { originalLength: html.length, minifiedLength: minified.length } };
}

export function minifyCss(css: string): DeveloperEngineResult {
  if (!css.trim()) return { success: true, output: "" };
  const minified = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([:;{}])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
  return { success: true, output: minified, metadata: { originalLength: css.length, minifiedLength: minified.length } };
}

export function convertHexToRgb(hex: string): DeveloperEngineResult {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 3 && clean.length !== 6) {
    return { success: false, output: "", error: "Hex code must be 3 or 6 characters (e.g. #3B82F6 or 3B82F6)" };
  }
  const fullHex = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  return {
    success: true,
    output: `rgb(${r}, ${g}, ${b})`,
    metadata: { r, g, b, rgba: `rgba(${r}, ${g}, ${b}, 1)` },
  };
}

export function convertRgbToHex(rgbStr: string): DeveloperEngineResult {
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) {
    return { success: false, output: "", error: "Please enter in format: rgb(59, 130, 246) or 59, 130, 246" };
  }
  const [r, g, b] = match.map(Number);
  if ([r, g, b].some((n) => isNaN(n) || n < 0 || n > 255)) {
    return { success: false, output: "", error: "RGB color components must be between 0 and 255" };
  }
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return { success: true, output: hex };
}

export function convertPxToRem(pxVal: number, basePx: number = 16): DeveloperEngineResult {
  if (isNaN(pxVal) || basePx <= 0) {
    return { success: false, output: "0rem", error: "Please enter valid pixel number" };
  }
  const rem = pxVal / basePx;
  return {
    success: true,
    output: `${Number(rem.toFixed(4))}rem`,
    metadata: { px: `${pxVal}px`, base: `${basePx}px`, rem: `${rem}rem` },
  };
}

export function encodeHtmlEntities(text: string): DeveloperEngineResult {
  if (!text) return { success: true, output: "" };
  const encoded = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  return { success: true, output: encoded };
}

export function decodeHtmlEntities(text: string): DeveloperEngineResult {
  if (!text) return { success: true, output: "" };
  const decoded = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
  return { success: true, output: decoded };
}

export function generateBoxShadow(
  offsetX: number = 0,
  offsetY: number = 10,
  blur: number = 25,
  spread: number = -5,
  color: string = "rgba(0, 0, 0, 0.3)",
  inset: boolean = false
): DeveloperEngineResult {
  const css = `box-shadow: ${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};`;
  return {
    success: true,
    output: css,
    metadata: { offsetX, offsetY, blur, spread, color, inset },
  };
}

export function generateGradient(
  type: "linear" | "radial" = "linear",
  angle: number = 135,
  color1: string = "#3b82f6",
  color2: string = "#8b5cf6",
  color3?: string
): DeveloperEngineResult {
  const stops = color3 ? `${color1}, ${color2}, ${color3}` : `${color1}, ${color2}`;
  const css =
    type === "linear"
      ? `background: linear-gradient(${angle}deg, ${stops});`
      : `background: radial-gradient(circle, ${stops});`;
  return {
    success: true,
    output: css,
    metadata: { type, angle, color1, color2, color3 },
  };
}

export function convertBinaryToDecimal(binaryStr: string): DeveloperEngineResult {
  const clean = binaryStr.trim().replace(/\s+/g, "");
  if (!/^[01]+$/.test(clean)) {
    return { success: false, output: "", error: "Please enter a valid binary number containing only 0 and 1." };
  }
  const decimal = parseInt(clean, 2);
  const hex = decimal.toString(16).toUpperCase();
  const octal = decimal.toString(8);

  return {
    success: true,
    output: `Decimal: ${decimal}\nHexadecimal: 0x${hex}\nOctal: ${octal}`,
    metadata: { decimal, hex, octal, binaryLength: clean.length },
  };
}

export function convertDecimalToBinary(decimalNum: number): DeveloperEngineResult {
  if (isNaN(decimalNum) || decimalNum < 0) {
    return { success: false, output: "", error: "Please enter a positive decimal integer." };
  }
  const intVal = Math.floor(decimalNum);
  const bin = intVal.toString(2);
  const pad8 = bin.padStart(Math.ceil(bin.length / 8) * 8, "0");
  const formatted8 = pad8.match(/.{1,8}/g)?.join(" ") || bin;

  return {
    success: true,
    output: `Binary: ${bin}\nFormatted Bytes: ${formatted8}\nHex: 0x${intVal.toString(16).toUpperCase()}`,
    metadata: { binary: bin, hex: intVal.toString(16), bits: bin.length },
  };
}

export function convertAsciiToHex(text: string, delimiter: "space" | "none" | "0x" = "space"): DeveloperEngineResult {
  if (!text) return { success: true, output: "" };
  const bytes = Array.from(new TextEncoder().encode(text));
  let output = "";
  if (delimiter === "0x") {
    output = bytes.map((b) => "0x" + b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  } else if (delimiter === "none") {
    output = bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
  } else {
    output = bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  return { success: true, output, metadata: { totalBytes: bytes.length } };
}

export function convertHexToAscii(hexStr: string): DeveloperEngineResult {
  try {
    const clean = hexStr.trim().replace(/0x/gi, "").replace(/[\s,:]+/g, "");
    if (clean.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(clean)) {
      return { success: false, output: "", error: "Invalid hexadecimal byte sequence." };
    }
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
    }
    const decoded = new TextDecoder().decode(bytes);
    return { success: true, output: decoded };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Hex decoding error" };
  }
}

export function convertJsonToYaml(jsonStr: string): DeveloperEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "" };
    const obj = JSON.parse(jsonStr);

    const toYaml = (val: unknown, indent: number = 0): string => {
      const space = " ".repeat(indent);
      if (val === null) return "null\n";
      if (typeof val === "boolean" || typeof val === "number") return `${val}\n`;
      if (typeof val === "string") return val.includes("\n") ? `|\n${space}  ${val.replace(/\n/g, "\n" + space + "  ")}\n` : `"${val}"\n`;
      if (Array.isArray(val)) {
        if (val.length === 0) return "[]\n";
        return "\n" + val.map((item) => `${space}- ${toYaml(item, indent + 2).trimStart()}`).join("");
      }
      if (typeof val === "object") {
        const entries = Object.entries(val);
        if (entries.length === 0) return "{}\n";
        return (
          (indent > 0 ? "\n" : "") +
          entries
            .map(([k, v]) => `${space}${k}: ${toYaml(v, indent + 2).trimStart()}`)
            .join("")
        );
      }
      return String(val) + "\n";
    };

    return { success: true, output: toYaml(obj).trim() };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid JSON input" };
  }
}

export function convertYamlToJson(yamlStr: string): DeveloperEngineResult {
  try {
    if (!yamlStr.trim()) return { success: true, output: "" };
    const lines = yamlStr.split("\n");
    const result: Record<string, unknown> = {};

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx > 0) {
        const key = trimmed.substring(0, colonIdx).trim().replace(/^["']|["']$/g, "");
        const rawVal = trimmed.substring(colonIdx + 1).trim();
        let val: unknown = rawVal;
        if (rawVal === "true") val = true;
        else if (rawVal === "false") val = false;
        else if (rawVal === "null") val = null;
        else if (!isNaN(Number(rawVal)) && rawVal !== "") val = Number(rawVal);
        else if (rawVal.startsWith('"') && rawVal.endsWith('"')) val = rawVal.slice(1, -1);
        else if (rawVal.startsWith("'") && rawVal.endsWith("'")) val = rawVal.slice(1, -1);
        result[key] = val;
      }
    });

    return { success: true, output: JSON.stringify(result, null, 2) };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "YAML parsing error" };
  }
}

export function convertCurlToFetch(curlCommand: string): DeveloperEngineResult {
  try {
    if (!curlCommand.trim()) return { success: true, output: "" };
    const clean = curlCommand.replace(/\\\n/g, " ").trim();
    
    // Extract URL
    const urlMatch = clean.match(/(?:curl\s+)?(?:['"])(https?:\/\/[^'"]+)(?:['"])|(?:curl\s+)(https?:\/\/[^\s]+)/i);
    const url = urlMatch ? (urlMatch[1] || urlMatch[2]) : "https://api.example.com/data";

    // Extract Method
    const methodMatch = clean.match(/-X\s+([A-Z]+)|--request\s+([A-Z]+)/i);
    let method = methodMatch ? (methodMatch[1] || methodMatch[2]).toUpperCase() : "GET";

    // Extract Headers
    const headerRegex = /-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/gi;
    const headers: Record<string, string> = {};
    let hMatch;
    while ((hMatch = headerRegex.exec(clean)) !== null) {
      const headerStr = hMatch[1] || hMatch[2];
      const [hKey, ...hValParts] = headerStr.split(":");
      if (hKey && hValParts.length > 0) {
        headers[hKey.trim()] = hValParts.join(":").trim();
      }
    }

    // Extract Body Data
    const dataMatch = clean.match(/(?:-d|--data|--data-raw)\s+['"]([^'"]+)['"]/i);
    let bodyData: string | undefined = undefined;
    if (dataMatch) {
      bodyData = dataMatch[1];
      if (method === "GET") method = "POST";
    }

    const fetchCode = `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)},${
      bodyData
        ? `\n  body: JSON.stringify(${bodyData.startsWith("{") ? bodyData : `"${bodyData}"`})`
        : ""
    }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;

    return { success: true, output: fetchCode };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "cURL parsing failed" };
  }
}

export function computeTextDiff(originalText: string, modifiedText: string): DeveloperEngineResult {
  const origLines = originalText.split("\n");
  const modLines = modifiedText.split("\n");
  const diffLines: string[] = [];

  const maxLen = Math.max(origLines.length, modLines.length);
  let changesCount = 0;

  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const m = modLines[i];

    if (o === undefined) {
      diffLines.push(`+ [Line ${i + 1}] ${m}`);
      changesCount++;
    } else if (m === undefined) {
      diffLines.push(`- [Line ${i + 1}] ${o}`);
      changesCount++;
    } else if (o === m) {
      diffLines.push(`  [Line ${i + 1}] ${o}`);
    } else {
      diffLines.push(`- [Line ${i + 1}] ${o}`);
      diffLines.push(`+ [Line ${i + 1}] ${m}`);
      changesCount++;
    }
  }

  return {
    success: true,
    output: diffLines.join("\n"),
    metadata: {
      totalOriginalLines: origLines.length,
      totalModifiedLines: modLines.length,
      differencesCount: changesCount,
    },
  };
}
