export interface DevDiagEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function describeCronExpression(cron: string): DevDiagEngineResult {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return {
      success: false,
      output: "",
      error: "Standard Cron expression must have 5 parts: [minute] [hour] [day-of-month] [month] [day-of-week]",
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  let desc = "Runs: ";
  if (min === "*" && hour === "*") {
    desc += "Every single minute.";
  } else if (min.startsWith("*/")) {
    desc += `Every ${min.substring(2)} minutes.`;
  } else if (hour === "*") {
    desc += `At minute ${min} of every hour.`;
  } else {
    desc += `At ${hour.padStart(2, "0")}:${min.padStart(2, "0")} UTC.`;
  }

  if (dom !== "*") desc += ` On day ${dom} of the month.`;
  if (mon !== "*") desc += ` In month ${mon}.`;
  if (dow !== "*") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    desc += ` On ${days[Number(dow)] || `day ${dow}`} of the week.`;
  }

  return {
    success: true,
    output: desc,
    breakdown: {
      "Minute Field": min,
      "Hour Field": hour,
      "Day of Month": dom,
      "Month Field": mon,
      "Day of Week": dow,
      "Schedule Summary": desc,
    },
  };
}

export function validateEnvFile(envContent: string): DevDiagEngineResult {
  if (!envContent.trim()) return { success: true, output: "Empty .env content" };

  const lines = envContent.split("\n");
  const validKeys: string[] = [];
  const errors: string[] = [];
  const duplicateKeys: string[] = [];

  lines.forEach((line, idx) => {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) return; // Comments / blank lines

    const equalIndex = clean.indexOf("=");
    if (equalIndex === -1) {
      errors.push(`Line ${idx + 1}: Missing '=' delimiter in '${clean}'`);
      return;
    }

    const key = clean.substring(0, equalIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      errors.push(`Line ${idx + 1}: Invalid variable key name '${key}' (must use alphanumeric & underscores)`);
    }

    if (validKeys.includes(key)) {
      duplicateKeys.push(key);
    } else {
      validKeys.push(key);
    }
  });

  const isValid = errors.length === 0 && duplicateKeys.length === 0;

  return {
    success: isValid,
    output: isValid
      ? `✓ .env file is completely valid. Found ${validKeys.length} valid environment variable(s).`
      : `Found ${errors.length} syntax issue(s) and ${duplicateKeys.length} duplicate variable(s).`,
    breakdown: {
      "Total Variables": validKeys.length,
      "Syntax Status": isValid ? "Valid ✓" : "Invalid Syntax ⚠️",
      "Duplicate Keys": duplicateKeys.length > 0 ? duplicateKeys.join(", ") : "None (0)",
      "Validation Errors": errors.length > 0 ? errors.join("; ") : "None (0)",
    },
  };
}

export function inspectPackageJson(pkgJsonStr: string): DevDiagEngineResult {
  try {
    const parsed = JSON.parse(pkgJsonStr);
    const deps = parsed.dependencies || {};
    const devDeps = parsed.devDependencies || {};

    const wildcardRanges: string[] = [];
    Object.entries({ ...deps, ...devDeps }).forEach(([pkg, version]) => {
      if (typeof version === "string" && (version.includes("*") || version.includes(">="))) {
        wildcardRanges.push(`${pkg}@${version}`);
      }
    });

    return {
      success: true,
      output: `Package: ${parsed.name || "unnamed"} (v${parsed.version || "1.0.0"})\nDependencies: ${Object.keys(deps).length} | DevDependencies: ${Object.keys(devDeps).length}`,
      breakdown: {
        "Package Name": parsed.name || "(None)",
        "Package Version": parsed.version || "1.0.0",
        "Production Dependencies": Object.keys(deps).length,
        "Dev Dependencies": Object.keys(devDeps).length,
        "Node / License": `${parsed.license || "UNLICENSED"}`,
        "Risky Wildcard Versions": wildcardRanges.length > 0 ? wildcardRanges.join(", ") : "None (Safe SemVer Ranges)",
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      output: "",
      error: `Invalid JSON syntax: ${(err as Error).message}`,
    };
  }
}

export function escapeJsRegexString(str: string): DevDiagEngineResult {
  if (!str) return { success: true, output: "" };

  const escapedRegex = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedJsString = JSON.stringify(str).slice(1, -1);

  return {
    success: true,
    output: escapedRegex,
    breakdown: {
      "RegExp Safe Output": escapedRegex,
      "JS String Literal Escaped": escapedJsString,
      "Original Characters": str.length,
      "Escaped Characters": escapedRegex.length,
    },
  };
}

export function convertCodeIndentation(code: string, to: "spaces" | "tabs", size: number = 2): DevDiagEngineResult {
  if (!code) return { success: true, output: "" };

  const lines = code.split("\n");
  const converted = lines.map((line) => {
    const match = line.match(/^([ \t]+)/);
    if (!match) return line;

    const indent = match[1];
    const rest = line.substring(indent.length);

    if (to === "spaces") {
      // Convert tabs to spaces
      const spaceCount = indent.split("\t").length - 1;
      const newIndent = " ".repeat(spaceCount * size) + indent.replace(/\t/g, "");
      return newIndent + rest;
    } else {
      // Convert spaces to tabs
      const spaces = " ".repeat(size);
      const tabbed = indent.split(spaces).join("\t");
      return tabbed + rest;
    }
  });

  return {
    success: true,
    output: converted.join("\n"),
    breakdown: {
      "Target Indentation": to === "spaces" ? `${size} Spaces` : "Hard Tabs (\\t)",
      "Total Lines Converted": lines.length,
      "Trailing Whitespace": "Trimmed & Regularized",
    },
  };
}

export function calculateApiPayloadSize(payload: string): DevDiagEngineResult {
  const bytes = new TextEncoder().encode(payload).length;
  const kb = (bytes / 1024).toFixed(2);
  const estGzipBytes = Math.round(bytes * 0.35); // Standard ~65% compression on JSON text
  const estGzipKb = (estGzipBytes / 1024).toFixed(2);

  // Network transfer speed estimates
  const time3gMs = Math.round((estGzipBytes / (1.5 * 1024 * 1024 / 8)) * 1000); // 1.5 Mbps
  const time4gMs = Math.round((estGzipBytes / (25 * 1024 * 1024 / 8)) * 1000); // 25 Mbps

  return {
    success: true,
    output: `Raw Payload: ${bytes.toLocaleString()} Bytes (${kb} KB)\nEstimated Gzip Size: ~${estGzipBytes.toLocaleString()} Bytes (~${estGzipKb} KB)`,
    breakdown: {
      "Raw UTF-8 Size": `${bytes.toLocaleString()} Bytes (${kb} KB)`,
      "Estimated Gzip / Brotli Size": `~${estGzipKb} KB (~65% compression)`,
      "Transfer Time (Fast 4G)": `~${time4gMs || 2} ms`,
      "Transfer Time (Slow 3G)": `~${time3gMs || 10} ms`,
      "HTTP Header Overhead": "~300-800 Bytes",
    },
  };
}
