export interface FileEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
  filesList?: Array<{ original: string; renamed: string }>;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function previewBatchRenaming(
  fileNames: string[],
  options: {
    prefix?: string;
    suffix?: string;
    findText?: string;
    replaceText?: string;
    useSequential?: boolean;
    startNumber?: number;
    digits?: number;
    caseFormat?: "none" | "lowercase" | "uppercase" | "kebab";
  }
): FileEngineResult {
  if (!fileNames || fileNames.length === 0) {
    return { success: true, output: "No files provided", filesList: [] };
  }

  const list: Array<{ original: string; renamed: string }> = [];
  const start = options.startNumber || 1;
  const digits = options.digits || 3;

  fileNames.forEach((name, idx) => {
    const lastDot = name.lastIndexOf(".");
    let base = lastDot !== -1 ? name.substring(0, lastDot) : name;
    const ext = lastDot !== -1 ? name.substring(lastDot) : "";

    // Find and replace
    if (options.findText) {
      base = base.split(options.findText).join(options.replaceText || "");
    }

    // Case formatting
    if (options.caseFormat === "lowercase") base = base.toLowerCase();
    else if (options.caseFormat === "uppercase") base = base.toUpperCase();
    else if (options.caseFormat === "kebab") base = base.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Sequential numbering
    let seq = "";
    if (options.useSequential) {
      seq = String(start + idx).padStart(digits, "0");
    }

    // Build final name
    const prefix = options.prefix || "";
    const suffix = options.suffix || "";
    const newName = options.useSequential
      ? `${prefix}${seq}${suffix ? `_${suffix}` : ""}${ext}`
      : `${prefix}${base}${suffix}${ext}`;

    list.push({ original: name, renamed: newName });
  });

  return {
    success: true,
    output: `${list.length} file(s) previewed for renaming.`,
    filesList: list,
    breakdown: {
      "Total Files": list.length,
      "Renaming Mode": options.useSequential ? "Sequential Indexing" : "Pattern Modification",
      "Prefix Applied": options.prefix || "(None)",
      "Suffix Applied": options.suffix || "(None)",
    },
  };
}

export function detectMagicNumbers(headerHex: string): string {
  const hex = headerHex.toUpperCase().replace(/\s/g, "");
  if (hex.startsWith("25504446")) return "PDF Document (%PDF)";
  if (hex.startsWith("89504E470D0A1A0A")) return "PNG Image (.png)";
  if (hex.startsWith("FFD8FF")) return "JPEG / JPG Image (.jpg)";
  if (hex.startsWith("504B0304") || hex.startsWith("504B0506")) return "ZIP / DOCX / XLSX Archive (.zip)";
  if (hex.startsWith("52494646") && hex.includes("57454250")) return "WebP Image (.webp)";
  if (hex.startsWith("47494638")) return "GIF Animation (.gif)";
  if (hex.startsWith("424D")) return "BMP Bitmap (.bmp)";
  if (hex.startsWith("1F8B08")) return "GZIP Compressed File (.gz)";
  if (hex.startsWith("0000001866747970") || hex.startsWith("0000002066747970")) return "MP4 Video (.mp4)";
  return "Unknown Binary Signature";
}
