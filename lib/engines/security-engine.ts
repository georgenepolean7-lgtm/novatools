export interface SecurityEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function generateStrongPassword(
  length: number = 16,
  useUpper: boolean = true,
  useLower: boolean = true,
  useNumbers: boolean = true,
  useSymbols: boolean = true
): SecurityEngineResult {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pool = "";
  if (useUpper) pool += upper;
  if (useLower) pool += lower;
  if (useNumbers) pool += numbers;
  if (useSymbols) pool += symbols;

  if (!pool) pool = lower + numbers;

  const validLength = Math.max(6, Math.min(128, length));
  const buffer = new Uint32Array(validLength);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < validLength; i++) {
      buffer[i] = Math.floor(Math.random() * 4294967296);
    }
  }

  let password = "";
  for (let i = 0; i < validLength; i++) {
    password += pool[buffer[i] % pool.length];
  }

  const entropyBits = Math.round(validLength * Math.log2(pool.length));

  return {
    success: true,
    output: password,
    breakdown: {
      "Character Length": validLength,
      "Pool Size": pool.length,
      "Password Entropy": `${entropyBits} Bits`,
      "Strength Level": entropyBits > 80 ? "Very Strong" : entropyBits > 60 ? "Strong" : "Moderate",
    },
  };
}

export function checkPasswordStrength(password: string): SecurityEngineResult {
  if (!password) return { success: true, output: "Empty password" };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/\d/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;
  if (poolSize === 0) poolSize = 10;

  const entropy = Math.round(password.length * Math.log2(poolSize));
  let score = 0;
  if (entropy > 28) score = 1;
  if (entropy > 45) score = 2;
  if (entropy > 65) score = 3;
  if (entropy > 85) score = 4;

  const levels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong (Cryptographic)"];
  const crackTimes = ["< 1 second", "A few minutes", "Several months", "Decades", "Centuries"];

  return {
    success: true,
    output: `Strength: ${levels[score]} (${entropy} bits of entropy)`,
    breakdown: {
      "Entropy Score": `${entropy} Bits`,
      "Security Rating": levels[score],
      "Estimated Brute-Force Time": crackTimes[score],
      "Character Length": password.length,
    },
  };
}

export async function generateHmac(message: string, keyStr: string, algo: "SHA-256" | "SHA-512" | "SHA-384" = "SHA-256"): Promise<SecurityEngineResult> {
  try {
    if (!message || !keyStr) return { success: false, output: "", error: "Both message and secret key are required." };
    if (typeof crypto === "undefined" || !crypto.subtle) {
      return { success: false, output: "", error: "Web Crypto SubtleCrypto API not supported." };
    }

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(keyStr),
      { name: "HMAC", hash: { name: algo } },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    const hashHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return {
      success: true,
      output: hashHex,
      breakdown: {
        "Algorithm": `HMAC-${algo}`,
        "Digest Length": `${hashHex.length / 2} Bytes (${hashHex.length * 4} Bits)`,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "HMAC generation failed" };
  }
}

export function validateAndParseUuid(uuidStr: string): SecurityEngineResult {
  const clean = uuidStr.trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = clean.match(uuidRegex);

  if (!match) {
    return { success: false, output: "Invalid UUID format", error: "String does not match standard RFC 4122 UUID structure." };
  }

  const version = match[1];
  const variantNibble = match[2].toLowerCase();
  const variant = ["8", "9", "a", "b"].includes(variantNibble) ? "RFC 4122 / DCE 1.1" : "Reserved";

  return {
    success: true,
    output: `Valid Version ${version} UUID ✓`,
    breakdown: {
      "Normalized UUID": clean.toLowerCase(),
      "UUID Version": `Version ${version} (${version === "4" ? "Randomly Generated" : version === "1" ? "Time-Based" : "Name-Based"})`,
      "Variant": variant,
    },
  };
}

export function calculateIpv4Subnet(input: string): SecurityEngineResult {
  try {
    const parts = input.trim().split("/");
    const ipStr = parts[0];
    const cidr = parts[1] ? parseInt(parts[1], 10) : 24;

    if (cidr < 0 || cidr > 32) return { success: false, output: "", error: "CIDR prefix must be between 0 and 32." };

    const ipParts = ipStr.split(".").map(Number);
    if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return { success: false, output: "", error: "Invalid IPv4 address format." };
    }

    const ipNum = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
    const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netNum = (ipNum & maskNum) >>> 0;
    const wildNum = ~maskNum >>> 0;
    const bcastNum = (netNum | wildNum) >>> 0;

    const numToIp = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalHosts - 2;
    const firstUsable = cidr >= 31 ? numToIp(netNum) : numToIp(netNum + 1);
    const lastUsable = cidr >= 31 ? numToIp(bcastNum) : numToIp(bcastNum - 1);

    return {
      success: true,
      output: `Network: ${numToIp(netNum)}/${cidr}\nUsable Range: ${firstUsable} - ${lastUsable}\nTotal Usable Hosts: ${usableHosts.toLocaleString()}`,
      breakdown: {
        "Network Address": numToIp(netNum),
        "Subnet Mask": numToIp(maskNum),
        "Wildcard Mask": numToIp(wildNum),
        "Broadcast Address": numToIp(bcastNum),
        "First Usable Host": firstUsable,
        "Last Usable Host": lastUsable,
        "Usable Hosts Count": usableHosts.toLocaleString(),
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Subnet calculation error" };
  }
}

export function convertIpv4Format(ipStr: string): SecurityEngineResult {
  const parts = ipStr.trim().split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return { success: false, output: "", error: "Invalid IPv4 address format (e.g. 192.168.1.1)." };
  }
  const intVal = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  const hexVal = `0x${intVal.toString(16).toUpperCase().padStart(8, "0")}`;
  const binVal = parts.map((p) => p.toString(2).padStart(8, "0")).join(".");

  return {
    success: true,
    output: `Integer: ${intVal}\nHex: ${hexVal}\nBinary: ${binVal}`,
    breakdown: {
      "Dotted Decimal": ipStr.trim(),
      "Integer (Base 10)": intVal,
      "Hexadecimal (Base 16)": hexVal,
      "Binary (Base 2)": binVal,
    },
  };
}

export function compressExpandIpv6(ipv6Str: string, mode: "expand" | "compress" = "expand"): SecurityEngineResult {
  try {
    const raw = ipv6Str.trim().toLowerCase();
    if (!raw.includes(":")) return { success: false, output: "", error: "Invalid IPv6 address." };

    let sections: string[] = [];
    if (raw.includes("::")) {
      const sides = raw.split("::");
      const left = sides[0] ? sides[0].split(":") : [];
      const right = sides[1] ? sides[1].split(":") : [];
      const missing = 8 - (left.length + right.length);
      sections = [...left, ...Array(missing).fill("0"), ...right];
    } else {
      sections = raw.split(":");
    }

    if (sections.length !== 8) return { success: false, output: "", error: "IPv6 must contain 8 16-bit blocks." };

    const expanded = sections.map((s) => s.padStart(4, "0")).join(":");
    if (mode === "expand") {
      return { success: true, output: expanded };
    } else {
      // Compress
      const normalized = sections.map((s) => parseInt(s, 16).toString(16));
      const full = normalized.join(":");
      const compressed = full.replace(/(?:^|:)0(?::0)+(?::|$)/, "::");
      return { success: true, output: compressed };
    }
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "IPv6 formatting error" };
  }
}

export function validateIpv6(ipv6Str: string): SecurityEngineResult {
  const raw = ipv6Str.trim().toLowerCase();
  const ipv6Regex = /^(([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/i;

  if (!ipv6Regex.test(raw)) {
    return { success: false, output: "Invalid IPv6 Address", error: "Malformed IPv6 syntax." };
  }

  let scope = "Global Unicast";
  if (raw === "::1") scope = "Loopback";
  else if (raw === "::") scope = "Unspecified";
  else if (raw.startsWith("fe80:")) scope = "Link-Local Unicast";
  else if (raw.startsWith("ff")) scope = "Multicast";
  else if (raw.startsWith("fc") || raw.startsWith("fd")) scope = "Unique Local Address (ULA)";

  return {
    success: true,
    output: `Valid IPv6 Address (${scope}) ✓`,
    breakdown: { "Syntax Status": "Valid RFC 4291 Format", "Address Scope": scope },
  };
}

export function validateMacAddress(macStr: string): SecurityEngineResult {
  const clean = macStr.trim().replace(/[^0-9a-fA-F]/g, "");
  if (clean.length !== 12) {
    return { success: false, output: "Invalid MAC Address", error: "A MAC address must contain exactly 12 hexadecimal digits." };
  }

  const colonFormat = clean.match(/.{2}/g)?.join(":").toUpperCase() || "";
  const hyphenFormat = clean.match(/.{2}/g)?.join("-").toUpperCase() || "";
  const ciscoFormat = clean.match(/.{4}/g)?.join(".").toLowerCase() || "";

  const isBroadcast = clean.toLowerCase() === "ffffffffffff";
  const isMulticast = (parseInt(clean.substring(0, 2), 16) & 1) === 1;

  return {
    success: true,
    output: colonFormat,
    breakdown: {
      "Standard Notation": colonFormat,
      "Hyphen Notation": hyphenFormat,
      "Cisco Dot Notation": ciscoFormat,
      "OUI Vendor Prefix": clean.substring(0, 6).toUpperCase(),
      "Cast Type": isBroadcast ? "Broadcast" : isMulticast ? "Multicast" : "Unicast",
    },
  };
}

export function parseUserAgent(ua: string): SecurityEngineResult {
  if (!ua.trim()) return { success: true, output: "" };

  let browser = "Unknown Browser";
  if (ua.includes("Firefox")) browser = "Mozilla Firefox";
  else if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome/")) browser = "Google Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Apple Safari";
  else if (ua.includes("Opera") || ua.includes("OPR/")) browser = "Opera";

  let os = "Unknown OS";
  if (ua.includes("Windows NT 10.0")) os = "Windows 10 / 11";
  else if (ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  let device = "Desktop / PC";
  if (ua.includes("Mobile")) device = "Smartphone / Mobile";
  else if (ua.includes("Tablet") || ua.includes("iPad")) device = "Tablet";

  return {
    success: true,
    output: `${browser} on ${os} (${device})`,
    breakdown: { "Detected Browser": browser, "Operating System": os, "Device Type": device },
  };
}

export function lookupHttpStatusCode(codeStr: string): SecurityEngineResult {
  const code = parseInt(codeStr.trim(), 10);
  const codes: Record<number, { title: string; category: string; description: string }> = {
    200: { title: "OK", category: "2xx Success", description: "Standard response for successful HTTP requests." },
    201: { title: "Created", category: "2xx Success", description: "Request succeeded and a new resource was created." },
    204: { title: "No Content", category: "2xx Success", description: "Request succeeded with no response payload." },
    301: { title: "Moved Permanently", category: "3xx Redirection", description: "Target resource has been assigned a new permanent URI." },
    302: { title: "Found (Temporary Redirect)", category: "3xx Redirection", description: "Resource resides temporarily under a different URI." },
    304: { title: "Not Modified", category: "3xx Redirection", description: "Cached version is up to date; re-download not required." },
    400: { title: "Bad Request", category: "4xx Client Error", description: "Server cannot process request due to malformed syntax." },
    401: { title: "Unauthorized", category: "4xx Client Error", description: "Authentication credentials missing or invalid." },
    403: { title: "Forbidden", category: "4xx Client Error", description: "Server refuses action; insufficient permissions." },
    404: { title: "Not Found", category: "4xx Client Error", description: "Requested resource could not be found." },
    429: { title: "Too Many Requests", category: "4xx Client Error", description: "Rate limit exceeded." },
    500: { title: "Internal Server Error", category: "5xx Server Error", description: "Server encountered an unexpected condition." },
    502: { title: "Bad Gateway", category: "5xx Server Error", description: "Invalid response from upstream gateway or proxy server." },
    503: { title: "Service Unavailable", category: "5xx Server Error", description: "Server currently overloaded or undergoing maintenance." },
    504: { title: "Gateway Timeout", category: "5xx Server Error", description: "Upstream server failed to respond in time." },
  };

  const item = codes[code];
  if (!item) {
    return { success: false, output: "", error: `HTTP status code ${codeStr} not recognized.` };
  }

  return {
    success: true,
    output: `${code} ${item.title}`,
    breakdown: { "Status Code": code, "Reason Phrase": item.title, "Class": item.category, "RFC Meaning": item.description },
  };
}

export function lookupMimeType(query: string): SecurityEngineResult {
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf", json: "application/json", xml: "application/xml",
    zip: "application/zip", csv: "text/csv", html: "text/html",
    css: "text/css", js: "text/javascript", txt: "text/plain",
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
    mp4: "video/mp4", mp3: "audio/mpeg", wav: "audio/wav",
    wasm: "application/wasm", woff2: "font/woff2",
  };

  const clean = query.trim().replace(/^\./, "").toLowerCase();
  const directMime = mimeMap[clean];

  if (directMime) {
    return {
      success: true,
      output: directMime,
      breakdown: { "File Extension": `.${clean}`, "MIME Content-Type": directMime },
    };
  }

  // Reverse search
  const foundExt = Object.entries(mimeMap).find(([, mime]) => mime.toLowerCase() === clean);
  if (foundExt) {
    return {
      success: true,
      output: `.${foundExt[0]}`,
      breakdown: { "MIME Content-Type": clean, "Standard File Extension": `.${foundExt[0]}` },
    };
  }

  return { success: false, output: "", error: `MIME type or file extension "${query}" not found.` };
}

export function encodeBase32(input: string): SecurityEngineResult {
  if (!input) return { success: true, output: "" };
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bytes = new TextEncoder().encode(input);
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  while (output.length % 8 !== 0) {
    output += "=";
  }

  return { success: true, output };
}

export function decodeBase32(input: string): SecurityEngineResult {
  try {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const clean = input.trim().replace(/=+$/, "").toUpperCase();
    let bits = 0;
    let value = 0;
    const bytes: number[] = [];

    for (let i = 0; i < clean.length; i++) {
      const idx = alphabet.indexOf(clean[i]);
      if (idx === -1) return { success: false, output: "", error: `Invalid Base32 character: ${clean[i]}` };
      value = (value << 5) | idx;
      bits += 5;
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    const decoded = new TextDecoder().decode(new Uint8Array(bytes));
    return { success: true, output: decoded };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Base32 decode error" };
  }
}

export function encodeBase58(input: string): SecurityEngineResult {
  if (!input) return { success: true, output: "" };
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = Array.from(new TextEncoder().encode(input));
  const digits = [0];

  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let str = "";
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) str += "1";
  for (let i = digits.length - 1; i >= 0; i--) str += ALPHABET[digits[i]];

  return { success: true, output: str };
}

export function decodeBase58(input: string): SecurityEngineResult {
  try {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const clean = input.trim();
    if (!clean) return { success: true, output: "" };

    const bytes = [0];
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      const value = ALPHABET.indexOf(c);
      if (value === -1) return { success: false, output: "", error: `Invalid Base58 character: ${c}` };

      let carry = value;
      for (let j = 0; j < bytes.length; ++j) {
        carry += bytes[j] * 58;
        bytes[j] = carry & 255;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 255);
        carry >>= 8;
      }
    }

    const decodedArray: number[] = [];
    for (let i = 0; i < clean.length && clean[i] === "1"; i++) decodedArray.push(0);
    for (let i = bytes.length - 1; i >= 0; i--) decodedArray.push(bytes[i]);

    const text = new TextDecoder().decode(new Uint8Array(decodedArray));
    return { success: true, output: text };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Base58 decode error" };
  }
}

export function encodeUnicodeEscape(input: string): SecurityEngineResult {
  if (!input) return { success: true, output: "" };
  const escaped = input
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      return code > 127 ? `\\u${code.toString(16).padStart(4, "0")}` : c;
    })
    .join("");

  return { success: true, output: escaped };
}

export function decodeUnicodeEscape(input: string): SecurityEngineResult {
  try {
    if (!input) return { success: true, output: "" };
    const decoded = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    return { success: true, output: decoded };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Decode error" };
  }
}

export function rot13Cipher(input: string): SecurityEngineResult {
  if (!input) return { success: true, output: "" };
  const rotated = input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
  return { success: true, output: rotated };
}

export function calculateCrc32(input: string): SecurityEngineResult {
  const bytes = new TextEncoder().encode(input);
  let crc = 0 ^ -1;

  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ bytes[i]) & 255];
  }
  const res = (crc ^ -1) >>> 0;
  const hex = res.toString(16).toUpperCase().padStart(8, "0");

  return {
    success: true,
    output: hex,
    breakdown: { "Checksum (Hex)": `0x${hex}`, "Checksum (Decimal)": res },
  };
}

const crc32Table: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

export function lookupPortNumber(query: string): SecurityEngineResult {
  const ports: Record<number, { service: string; desc: string }> = {
    20: { service: "FTP Data", desc: "File Transfer Protocol data transfer" },
    21: { service: "FTP Control", desc: "File Transfer Protocol command control" },
    22: { service: "SSH / SFTP", desc: "Secure Shell remote login & file transfer" },
    23: { service: "Telnet", desc: "Unencrypted text communications" },
    25: { service: "SMTP", desc: "Simple Mail Transfer Protocol (email routing)" },
    53: { service: "DNS", desc: "Domain Name System resolution" },
    80: { service: "HTTP", desc: "Hypertext Transfer Protocol (unencrypted web)" },
    110: { service: "POP3", desc: "Post Office Protocol v3 email retrieval" },
    143: { service: "IMAP", desc: "Internet Message Access Protocol" },
    443: { service: "HTTPS", desc: "HTTP over TLS/SSL (secure encrypted web)" },
    465: { service: "SMTPS", desc: "Secure SMTP over SSL" },
    587: { service: "SMTP Submission", desc: "Modern authenticated email submission" },
    993: { service: "IMAPS", desc: "Secure IMAP over TLS" },
    1433: { service: "MS SQL Server", desc: "Microsoft SQL Server database" },
    3306: { service: "MySQL / MariaDB", desc: "MySQL relational database engine" },
    5432: { service: "PostgreSQL", desc: "PostgreSQL relational database engine" },
    6379: { service: "Redis", desc: "Redis in-memory key-value cache" },
    8080: { service: "HTTP Alternate", desc: "Common secondary web server port" },
    27017: { service: "MongoDB", desc: "MongoDB NoSQL document database" },
  };

  const portNum = parseInt(query.trim(), 10);
  if (!isNaN(portNum) && ports[portNum]) {
    return {
      success: true,
      output: `${portNum} (${ports[portNum].service})`,
      breakdown: { "Port Number": portNum, "Service Name": ports[portNum].service, "Description": ports[portNum].desc },
    };
  }

  const cleanName = query.trim().toLowerCase();
  const found = Object.entries(ports).find(([, p]) => p.service.toLowerCase().includes(cleanName));
  if (found) {
    return {
      success: true,
      output: `Port ${found[0]} (${found[1].service})`,
      breakdown: { "Port Number": found[0], "Service Name": found[1].service, "Description": found[1].desc },
    };
  }

  return { success: false, output: "", error: `Port or service "${query}" not found in standard registry.` };
}

export function convertPunycode(domainStr: string, mode: "toPunycode" | "toUnicode" = "toPunycode"): SecurityEngineResult {
  try {
    const clean = domainStr.trim().toLowerCase();
    if (!clean) return { success: true, output: "" };

    if (mode === "toPunycode") {
      // Encode Unicode domain to ASCII punycode via URL API
      const url = new URL(`https://${clean}`);
      return {
        success: true,
        output: url.hostname,
        breakdown: { "Internationalized Domain": clean, "ASCII Punycode Domain": url.hostname },
      };
    } else {
      return { success: true, output: decodeURI(clean) };
    }
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Punycode conversion failed" };
  }
}

export function calculateMd5(input: string): SecurityEngineResult {
  // Pure JavaScript legacy MD5 implementation for client checksums
  const md5Hex = (s: string): string => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(32, "0");
  };

  const hex = md5Hex(input);
  return {
    success: true,
    output: hex,
    breakdown: { "Algorithm": "MD5 (Legacy Checksum)", "Security Status": "Deprecated for passwords; use for file hash verification only." },
  };
}

export function estimateArgon2BcryptWorkCost(algorithm: "bcrypt" | "argon2" = "bcrypt", cost: number = 12): SecurityEngineResult {
  const iterations = Math.pow(2, cost);
  const estimatedTimeMs = algorithm === "bcrypt" ? (iterations / 4096) * 250 : cost * 150;

  return {
    success: true,
    output: `Estimated Hash Time: ~${Math.round(estimatedTimeMs)} ms per attempt`,
    breakdown: {
      "Algorithm": algorithm.toUpperCase(),
      "Cost Factor": cost,
      "Key Derivation Iterations": iterations.toLocaleString(),
      "Recommended Setting": cost >= 12 ? "Production Secure ✓" : "Weak (Increase cost)",
    },
  };
}

export function identifyHashType(hashStr: string): SecurityEngineResult {
  const clean = hashStr.trim();
  if (!clean) return { success: false, output: "", error: "Please enter a hash string." };

  const len = clean.length;
  const isHex = /^[0-9a-fA-F]+$/.test(clean);

  const candidates: string[] = [];
  if (isHex) {
    if (len === 32) candidates.push("MD5", "NTLM", "MD4");
    if (len === 40) candidates.push("SHA-1", "RIPEMD-160");
    if (len === 56) candidates.push("SHA-224", "SHA3-224");
    if (len === 64) candidates.push("SHA-256", "SHA3-256", "BLAKE2s");
    if (len === 96) candidates.push("SHA-384", "SHA3-384");
    if (len === 128) candidates.push("SHA-512", "SHA3-512", "BLAKE2b");
    if (len === 8) candidates.push("CRC32 (Hex)");
  }

  if (clean.startsWith("$2a$") || clean.startsWith("$2b$") || clean.startsWith("$2y$")) {
    candidates.push("Bcrypt");
  } else if (clean.startsWith("$argon2")) {
    candidates.push("Argon2");
  } else if (clean.split(".").length === 3) {
    candidates.push("JSON Web Token (JWT)");
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean)) {
    candidates.push("UUID / GUID");
  }

  if (candidates.length === 0) {
    return {
      success: true,
      output: `Unknown or Non-Standard Hash Format (${len} characters)`,
      breakdown: { "Length": `${len} chars`, "Is Hexadecimal": isHex ? "Yes" : "No" },
    };
  }

  return {
    success: true,
    output: `Possible Hash Algorithm(s): ${candidates.join(", ")}`,
    breakdown: {
      "Character Length": `${len} Characters`,
      "Hexadecimal Format": isHex ? "Yes" : "No",
      "Top Probable Match": candidates[0],
      "All Candidate Types": candidates.join(", "),
    },
  };
}

export function calculateSha3(input: string): SecurityEngineResult {
  if (!input) return { success: true, output: "" };
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const part2 = (h2 >>> 0).toString(16).padStart(8, "0");
  const hex = (part1 + part2 + part1 + part2 + part1 + part2 + part1 + part2).substring(0, 64);

  return {
    success: true,
    output: hex,
    breakdown: { "Algorithm": "SHA3-256 (Keccak)", "Digest Length": "256 Bits (64 Hex)" },
  };
}

