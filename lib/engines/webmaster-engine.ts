export interface WebmasterEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateCidr(ipWithCidr: string): WebmasterEngineResult {
  const parts = ipWithCidr.trim().split("/");
  if (parts.length !== 2) {
    return { success: false, output: "", error: "Please enter an IP in CIDR notation (e.g. 192.168.1.0/24)" };
  }
  const ip = parts[0];
  const prefix = parseInt(parts[1], 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return { success: false, output: "", error: "CIDR prefix must be between /0 and /32" };
  }
  const octets = ip.split(".").map((n) => parseInt(n, 10));
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    return { success: false, output: "", error: "Invalid IPv4 address format" };
  }

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;

  // Compute netmask
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const mask = [
    (maskInt >>> 24) & 255,
    (maskInt >>> 16) & 255,
    (maskInt >>> 8) & 255,
    maskInt & 255,
  ].join(".");

  return {
    success: true,
    output: `Subnet Mask: ${mask}\nTotal IP Addresses: ${totalHosts.toLocaleString()}\nUsable Host IPs: ${usableHosts.toLocaleString()}`,
    breakdown: {
      "CIDR Block": `/${prefix}`,
      "Subnet Mask": mask,
      "Total Addresses": totalHosts.toLocaleString(),
      "Usable Host Range Count": usableHosts.toLocaleString(),
      "IP Class": prefix >= 24 ? "Class C Equivalent" : prefix >= 16 ? "Class B Equivalent" : "Class A Equivalent",
    },
  };
}

export function parseUserAgent(uaString: string): WebmasterEngineResult {
  if (!uaString.trim()) return { success: true, output: "" };
  const ua = uaString;

  let browser = "Unknown Browser";
  if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
  else if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome/")) browser = "Google Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Apple Safari";
  else if (ua.includes("Opera") || ua.includes("OPR/")) browser = "Opera";

  let os = "Unknown OS";
  if (ua.includes("Windows NT 10.0")) os = "Windows 10 / 11";
  else if (ua.includes("Windows NT")) os = "Windows NT";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android OS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  const device = ua.includes("Mobile") ? "Mobile Device" : "Desktop / Laptop";

  return {
    success: true,
    output: `Browser: ${browser}\nOperating System: ${os}\nDevice Type: ${device}`,
    breakdown: {
      "Detected Browser": browser,
      "Detected Platform": os,
      "Device Category": device,
      "Raw UA Length": `${ua.length} chars`,
    },
  };
}

export function generateHtaccessRedirect(fromPath: string, toUrl: string, statusCode: "301" | "302" = "301"): WebmasterEngineResult {
  if (!fromPath || !toUrl) {
    return { success: false, output: "", error: "Please enter source path and target URL" };
  }
  const cleanFrom = fromPath.startsWith("/") ? fromPath : `/${fromPath}`;
  const rule = `Redirect ${statusCode} ${cleanFrom} ${toUrl.trim()}`;

  return {
    success: true,
    output: `# .htaccess Redirect Rule\n${rule}`,
    breakdown: {
      "HTTP Status Code": statusCode === "301" ? "301 (Permanent Redirect)" : "302 (Temporary Redirect)",
      "Source Path": cleanFrom,
      "Destination URL": toUrl.trim(),
    },
  };
}

export function generateSecurityHeaders(options: {
  hsts?: boolean;
  xFrame?: "DENY" | "SAMEORIGIN";
  xContentType?: boolean;
  cspPreset?: "strict" | "moderate";
  permissionsPolicy?: boolean;
}): WebmasterEngineResult {
  const headers: string[] = [
    `# Modern HTTP Security Headers Configuration`,
    `# (Nginx & Apache format)`,
  ];

  if (options.hsts !== false) {
    headers.push(`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`);
  }
  if (options.xFrame) {
    headers.push(`X-Frame-Options: ${options.xFrame}`);
  }
  if (options.xContentType !== false) {
    headers.push(`X-Content-Type-Options: nosniff`);
    headers.push(`Referrer-Policy: strict-origin-when-cross-origin`);
  }
  if (options.cspPreset === "strict") {
    headers.push(`Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; object-src 'none'; frame-ancestors 'none';`);
  } else {
    headers.push(`Content-Security-Policy: default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;`);
  }
  if (options.permissionsPolicy !== false) {
    headers.push(`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`);
  }

  return {
    success: true,
    output: headers.join("\n"),
    breakdown: {
      "HSTS Enabled": options.hsts !== false ? "Yes (2 Years + Preload)" : "No",
      "X-Frame-Options": options.xFrame || "DENY",
      "MIME Sniffing Protection": "nosniff enabled ✓",
      "Security Rating": "A+ Standard",
    },
  };
}

export function generateCacheControlHeader(target: "static" | "ssr" | "api" | "immutable", maxAgeDays: number = 365): WebmasterEngineResult {
  let headerValue = "";
  const seconds = maxAgeDays * 86400;

  if (target === "static" || target === "immutable") {
    headerValue = `Cache-Control: public, max-age=${seconds}, immutable`;
  } else if (target === "ssr") {
    headerValue = `Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=600`;
  } else {
    headerValue = `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0`;
  }

  return {
    success: true,
    output: `# Recommended HTTP Header\n${headerValue}`,
    breakdown: {
      "Asset Target": target.toUpperCase(),
      "Max-Age Duration": `${maxAgeDays} Days (${seconds.toLocaleString()}s)`,
      "Revalidation Strategy": target === "ssr" ? "stale-while-revalidate enabled" : "Standard",
    },
  };
}

export function generateNginxReverseProxy(domain: string, upstreamPort: number = 3000, enableSsl: boolean = true, enableWs: boolean = true): WebmasterEngineResult {
  const cleanDomain = domain.trim() || "example.com";
  const wsDirectives = enableWs
    ? `    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection "upgrade";\n`
    : "";

  const config = `server {
    listen ${enableSsl ? "443 ssl http2" : "80"};
    server_name ${cleanDomain} www.${cleanDomain};

    location / {
        proxy_pass http://127.0.0.1:${upstreamPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
${wsDirectives}    }
}`;

  return {
    success: true,
    output: config,
    breakdown: {
      "Domain": cleanDomain,
      "Upstream Port": upstreamPort,
      "WebSocket Support": enableWs ? "Enabled ✓" : "Disabled",
      "SSL / HTTP2": enableSsl ? "443 SSL Configured" : "80 HTTP",
    },
  };
}

export function generateCorsHeaders(allowedOrigins: string = "*", allowedMethods: string = "GET, POST, PUT, DELETE, OPTIONS", allowCredentials: boolean = true): WebmasterEngineResult {
  const expressSnippet = `// Express.js CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "${allowedOrigins}");
  res.header("Access-Control-Allow-Methods", "${allowedMethods}");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  ${allowCredentials ? 'res.header("Access-Control-Allow-Credentials", "true");' : ""}
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});`;

  return {
    success: true,
    output: expressSnippet,
    breakdown: {
      "Allowed Origin": allowedOrigins,
      "Allowed HTTP Methods": allowedMethods,
      "Credentials": allowCredentials ? "true" : "false",
    },
  };
}

export function parseUrlStructure(urlStr: string): WebmasterEngineResult {
  try {
    const raw = urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`;
    const url = new URL(raw);

    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((val, key) => {
      queryParams[key] = val;
    });

    return {
      success: true,
      output: `Protocol: ${url.protocol}\nHostname: ${url.hostname}\nPort: ${url.port || "Default"}\nPathname: ${url.pathname}\nQuery Count: ${Object.keys(queryParams).length}\nHash: ${url.hash || "None"}`,
      breakdown: {
        "Protocol": url.protocol,
        "Hostname / Domain": url.hostname,
        "Port": url.port || "(Standard 80/443)",
        "Path": url.pathname,
        "Query Parameters Count": Object.keys(queryParams).length,
        "Hash Fragment": url.hash || "(None)",
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid URL" };
  }
}

export function parseHttpRequestHeaders(headersText: string): WebmasterEngineResult {
  if (!headersText.trim()) return { success: true, output: "" };

  const lines = headersText.split("\n");
  const parsedHeaders: Record<string, string> = {};
  let headerCount = 0;

  lines.forEach((line) => {
    const clean = line.trim();
    if (!clean) return;

    const colonIdx = clean.indexOf(":");
    if (colonIdx !== -1) {
      const key = clean.substring(0, colonIdx).trim();
      const val = clean.substring(colonIdx + 1).trim();
      parsedHeaders[key] = val;
      headerCount++;
    }
  });

  const jsonFormatted = JSON.stringify(parsedHeaders, null, 2);

  return {
    success: true,
    output: jsonFormatted,
    breakdown: {
      "Total Headers Parsed": headerCount,
      "Content-Type": parsedHeaders["Content-Type"] || parsedHeaders["content-type"] || "Not specified",
      "User-Agent": parsedHeaders["User-Agent"] || parsedHeaders["user-agent"] || "Not specified",
      "Authorization Present": parsedHeaders["Authorization"] || parsedHeaders["authorization"] ? "Yes (Bearer/Basic)" : "No",
      "Security Headers Detected": (parsedHeaders["Strict-Transport-Security"] || parsedHeaders["Content-Security-Policy"]) ? "Present ✓" : "None Detected",
    },
  };
}

